from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    environment: str = Field(default="development", alias="ENVIRONMENT")
    upload_dir: str = Field(default="./uploads", alias="UPLOAD_DIR")
    
    class Config:
        env_file = ".env"

settings = Settings()
