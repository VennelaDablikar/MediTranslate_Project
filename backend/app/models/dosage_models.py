from pydantic import BaseModel
from typing import List

class DosageResponse(BaseModel):
    dosages: List[str]
