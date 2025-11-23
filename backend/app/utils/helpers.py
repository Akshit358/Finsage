"""
Utility functions and helpers for the FinSage application.
Contains reusable functions for data processing, validation, and common operations.
"""

import re
import hashlib
import secrets
from typing import Any, Dict, List, Optional, Union
from datetime import datetime, timedelta
import json


def validate_ethereum_address(address: str) -> bool:
    """
    Validate Ethereum address format.
    
    Args:
        address: Ethereum address to validate
        
    Returns:
        True if valid, False otherwise
    """
    if not address:
        return False
    
    # Remove 0x prefix if present
    if address.startswith('0x'):
        address = address[2:]
    
    # Check if it's a valid hex string and 40 characters long
    if len(address) != 40:
        return False
    
    try:
        int(address, 16)
        return True
    except ValueError:
        return False


def validate_email(email: str) -> bool:
    """
    Validate email address format.
    
    Args:
        email: Email address to validate
        
    Returns:
        True if valid, False otherwise
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def generate_secure_token(length: int = 32) -> str:
    """
    Generate a secure random token.
    
    Args:
        length: Length of the token in bytes
        
    Returns:
        Hex-encoded secure token
    """
    return secrets.token_hex(length)


def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    """
    Hash a password with salt.
    
    Args:
        password: Plain text password
        salt: Optional salt (generated if not provided)
        
    Returns:
        Tuple of (hashed_password, salt)
    """
    if salt is None:
        salt = secrets.token_hex(16)
    
    # Combine password and salt
    salted_password = password + salt
    
    # Hash using SHA-256
    hashed = hashlib.sha256(salted_password.encode()).hexdigest()
    
    return hashed, salt


def verify_password(password: str, hashed_password: str, salt: str) -> bool:
    """
    Verify a password against its hash.
    
    Args:
        password: Plain text password
        hashed_password: Stored hashed password
        salt: Salt used for hashing
        
    Returns:
        True if password matches, False otherwise
    """
    test_hash, _ = hash_password(password, salt)
    return test_hash == hashed_password


def format_currency(amount: float, currency: str = "USD", decimals: int = 2) -> str:
    """
    Format currency amount for display.
    
    Args:
        amount: Amount to format
        currency: Currency code
        decimals: Number of decimal places
        
    Returns:
        Formatted currency string
    """
    if currency == "USD":
        return f"${amount:,.{decimals}f}"
    else:
        return f"{amount:,.{decimals}f} {currency}"


def calculate_percentage_change(old_value: float, new_value: float) -> float:
    """
    Calculate percentage change between two values.
    
    Args:
        old_value: Original value
        new_value: New value
        
    Returns:
        Percentage change
    """
    if old_value == 0:
        return 0.0
    
    return ((new_value - old_value) / old_value) * 100


def calculate_compound_interest(principal: float, rate: float, 
                              time_years: float, compounding_frequency: int = 12) -> float:
    """
    Calculate compound interest.
    
    Args:
        principal: Initial amount
        rate: Annual interest rate (as decimal)
        time_years: Time in years
        compounding_frequency: Number of times interest compounds per year
        
    Returns:
        Final amount after compound interest
    """
    amount = principal * (1 + rate / compounding_frequency) ** (compounding_frequency * time_years)
    return amount


def calculate_portfolio_performance(initial_value: float, current_value: float, 
                                  time_period_days: int) -> Dict[str, float]:
    """
    Calculate portfolio performance metrics.
    
    Args:
        initial_value: Initial portfolio value
        current_value: Current portfolio value
        time_period_days: Time period in days
        
    Returns:
        Dictionary with performance metrics
    """
    total_return = current_value - initial_value
    total_return_percentage = calculate_percentage_change(initial_value, current_value)
    
    # Annualized return
    years = time_period_days / 365.25
    annualized_return = ((current_value / initial_value) ** (1 / years) - 1) * 100 if years > 0 else 0
    
    return {
        "total_return": total_return,
        "total_return_percentage": total_return_percentage,
        "annualized_return": annualized_return,
        "time_period_days": time_period_days
    }


def safe_json_loads(json_string: str, default: Any = None) -> Any:
    """
    Safely load JSON string with error handling.
    
    Args:
        json_string: JSON string to parse
        default: Default value if parsing fails
        
    Returns:
        Parsed JSON or default value
    """
    try:
        return json.loads(json_string)
    except (json.JSONDecodeError, TypeError):
        return default


def safe_json_dumps(obj: Any, default: str = "{}") -> str:
    """
    Safely dump object to JSON string with error handling.
    
    Args:
        obj: Object to serialize
        default: Default string if serialization fails
        
    Returns:
        JSON string or default string
    """
    try:
        return json.dumps(obj, default=str)
    except (TypeError, ValueError):
        return default


def truncate_string(text: str, max_length: int, suffix: str = "...") -> str:
    """
    Truncate string to maximum length with suffix.
    
    Args:
        text: Text to truncate
        max_length: Maximum length
        suffix: Suffix to add if truncated
        
    Returns:
        Truncated string
    """
    if len(text) <= max_length:
        return text
    
    return text[:max_length - len(suffix)] + suffix


def format_timestamp(timestamp: Union[datetime, str, float], 
                    format_string: str = "%Y-%m-%d %H:%M:%S") -> str:
    """
    Format timestamp to string.
    
    Args:
        timestamp: Timestamp to format
        format_string: Format string
        
    Returns:
        Formatted timestamp string
    """
    if isinstance(timestamp, str):
        try:
            timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
        except ValueError:
            return timestamp
    
    if isinstance(timestamp, (int, float)):
        timestamp = datetime.fromtimestamp(timestamp)
    
    if isinstance(timestamp, datetime):
        return timestamp.strftime(format_string)
    
    return str(timestamp)


def calculate_age(birth_date: datetime) -> int:
    """
    Calculate age from birth date.
    
    Args:
        birth_date: Birth date
        
    Returns:
        Age in years
    """
    today = datetime.now()
    age = today.year - birth_date.year
    
    # Adjust if birthday hasn't occurred this year
    if today.month < birth_date.month or (today.month == birth_date.month and today.day < birth_date.day):
        age -= 1
    
    return age


def is_business_day(date: datetime) -> bool:
    """
    Check if a date is a business day (Monday-Friday).
    
    Args:
        date: Date to check
        
    Returns:
        True if business day, False otherwise
    """
    return date.weekday() < 5  # Monday = 0, Sunday = 6


def get_next_business_day(date: datetime) -> datetime:
    """
    Get the next business day from a given date.
    
    Args:
        date: Starting date
        
    Returns:
        Next business day
    """
    next_day = date + timedelta(days=1)
    
    while not is_business_day(next_day):
        next_day += timedelta(days=1)
    
    return next_day


def validate_portfolio_data(portfolio_data: Dict[str, Any]) -> List[str]:
    """
    Validate portfolio data and return list of errors.
    
    Args:
        portfolio_data: Portfolio data to validate
        
    Returns:
        List of validation errors
    """
    errors = []
    
    # Check required fields
    required_fields = ["user_id", "assets"]
    for field in required_fields:
        if field not in portfolio_data:
            errors.append(f"Missing required field: {field}")
    
    # Validate assets if present
    if "assets" in portfolio_data:
        assets = portfolio_data["assets"]
        if not isinstance(assets, list):
            errors.append("Assets must be a list")
        else:
            for i, asset in enumerate(assets):
                asset_errors = validate_asset_data(asset, i)
                errors.extend(asset_errors)
    
    return errors


def validate_asset_data(asset: Dict[str, Any], index: int) -> List[str]:
    """
    Validate individual asset data.
    
    Args:
        asset: Asset data to validate
        index: Asset index for error reporting
        
    Returns:
        List of validation errors
    """
    errors = []
    
    required_fields = ["symbol", "name", "quantity", "current_price"]
    for field in required_fields:
        if field not in asset:
            errors.append(f"Asset {index}: Missing required field: {field}")
    
    # Validate numeric fields
    numeric_fields = ["quantity", "current_price", "total_value"]
    for field in numeric_fields:
        if field in asset:
            try:
                value = float(asset[field])
                if value < 0:
                    errors.append(f"Asset {index}: {field} must be non-negative")
            except (ValueError, TypeError):
                errors.append(f"Asset {index}: {field} must be a valid number")
    
    return errors


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename for safe file system usage.
    
    Args:
        filename: Original filename
        
    Returns:
        Sanitized filename
    """
    # Remove or replace invalid characters
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    
    # Remove leading/trailing spaces and dots
    filename = filename.strip(' .')
    
    # Ensure filename is not empty
    if not filename:
        filename = "unnamed"
    
    # Limit length
    if len(filename) > 255:
        filename = filename[:255]
    
    return filename


def get_file_extension(filename: str) -> str:
    """
    Get file extension from filename.
    
    Args:
        filename: Filename
        
    Returns:
        File extension (without dot)
    """
    if '.' not in filename:
        return ""
    
    return filename.split('.')[-1].lower()


def is_valid_file_type(filename: str, allowed_extensions: List[str]) -> bool:
    """
    Check if file has allowed extension.
    
    Args:
        filename: Filename to check
        allowed_extensions: List of allowed extensions
        
    Returns:
        True if valid, False otherwise
    """
    extension = get_file_extension(filename)
    return extension in [ext.lower() for ext in allowed_extensions]
