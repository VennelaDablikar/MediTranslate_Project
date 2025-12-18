import os
from fastapi import APIRouter, HTTPException, Header, status
from supabase import create_client, Client
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

# Initialize Supabase Admin Client
url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
# CRITICAL: This must be the SERVICE ROLE key, not the anon key, to delete users.
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url:
    print("Warning: NEXT_PUBLIC_SUPABASE_URL not set.")
if not key:
    print("Warning: SUPABASE_SERVICE_ROLE_KEY not set. Account deletion will fail.")

supabase_admin: Client = create_client(url, key) if url and key else None

class DeleteAccountRequest(BaseModel):
    user_id: str

@router.delete("/delete-account")
async def delete_account(
    authorization: Optional[str] = Header(None)
):
    """
    Deletes the user account permanently.
    Requires a valid session token in the Authorization header to identify the user.
    """
    if not supabase_admin:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server misconfigured: Missing service role key."
        )

    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header"
        )

    try:
        # 1. Verify the user using the token provided in headers
        # We use the anon/public client method 'get_user' via the token to verify identity
        # But here we act as middleware verification. 
        # For simplicity in this backend, we can just get the user from the token using the admin client 
        # (or a regular client if we had one instantiated for auth).
        
        # Actually, let's use the token to get the user ID securely.
        token = authorization.replace("Bearer ", "")
        user_response = supabase_admin.auth.get_user(token)
        
        if not user_response or not user_response.user:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
        
        user_id = user_response.user.id

        # 2. Delete the user using the admin client
        # delete_user is an admin-only function
        response = supabase_admin.auth.admin.delete_user(user_id)
        
        # Note: supabase-py admin.delete_user typically returns None on success or throws error
        print(f"Deleted user: {user_id}")
        
        return {"message": "Account deleted successfully", "deleted_user_id": user_id}

    except Exception as e:
        print(f"Error deleting account: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete account: {str(e)}"
        )
