from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    environment: str = Field(default="development", alias="ENVIRONMENT")
    upload_dir: str = Field(default="./uploads", alias="UPLOAD_DIR")
    database_url: str = Field(
        default="postgresql://finmate_user:finmate_password@localhost:5432/finmate",
        alias="DATABASE_URL"
    )
    ollama_host: str = Field(default="http://localhost:11434", alias="OLLAMA_HOST")

    class Config:
        env_file = ".env"

settings = Settings()
