import io
import logging
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from google.cloud import vision

logger = logging.getLogger(__name__)

# Load TrOCR model once at startup (lazy load on first use)
_trocr_processor = None
_trocr_model = None

def _load_trocr():
    """Lazy load TrOCR model and processor."""
    global _trocr_processor, _trocr_model
    if _trocr_processor is None or _trocr_model is None:
        logger.info("Loading TrOCR model...")
        # Use handwritten TrOCR for better prescription handwriting handling
        _trocr_processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
        _trocr_model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")
    return _trocr_processor, _trocr_model

async def extract_text_trocr(img_bytes: bytes) -> str:
    """Extract text using TrOCR (local, no billing required)."""
    try:
        processor, model = _load_trocr()
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        
        pixel_values = processor(images=img, return_tensors="pt").pixel_values
        generated_ids = model.generate(pixel_values)
        generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        
        logger.info(f"TrOCR extracted {len(generated_text)} characters")
        return generated_text
    except Exception as e:
        logger.error(f"TrOCR error: {e}")
        raise

async def extract_text_google(img_bytes: bytes) -> str:
    """Extract text using Google Vision API (requires billing).

    Accepts raw image bytes rather than re-reading the UploadFile stream.
    """
    try:
        client = vision.ImageAnnotatorClient()
        image = vision.Image(content=img_bytes)
        response = client.document_text_detection(image=image)

        if response.error.message:
            raise Exception(f"Google Vision error: {response.error.message}")

        logger.info(f"Google Vision extracted {len(response.full_text_annotation.text)} characters")
        return response.full_text_annotation.text
    except Exception as e:
        logger.error(f"Google Vision error: {e}")
        raise

async def extract_text(file):
    """Extract text using Google Vision; fallback to TrOCR if Vision fails.

    Read the upload once into bytes and pass the bytes to both engines to
    avoid exhausting the upload stream.
    """
    img_bytes = await file.read()

    # Try Google Vision first (pass bytes directly)
    try:
        return await extract_text_google(img_bytes)
    except Exception as e:
        logger.warning(f"Google Vision failed ({e}), falling back to TrOCR...")
        try:
            return await extract_text_trocr(img_bytes)
        except Exception as trocr_error:
            logger.error(f"Both OCR engines failed. Google: {e}, TrOCR: {trocr_error}")
            return f"OCR Error: Both engines failed. Google: {str(e)[:200]}, TrOCR: {str(trocr_error)[:200]}"
