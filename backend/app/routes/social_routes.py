"""
Social Trading Routes
Provides social trading features, user profiles, and community features
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Dict, List, Any, Optional
from app.services.social_trading_service import SocialTradingService
from app.core.logger import app_logger

router = APIRouter(prefix="/social", tags=["Social Trading"])

@router.post("/profile")
async def create_user_profile(
    user_id: str,
    profile_data: Dict[str, Any],
    social_service: SocialTradingService = Depends()
):
    """
    Create or update user profile.
    
    Example: POST /social/profile?user_id=123
    Body: {
        "username": "trader123",
        "display_name": "John Trader",
        "bio": "Experienced trader",
        "investment_style": "Growth",
        "risk_tolerance": "High"
    }
    """
    app_logger.info(f"Creating/updating profile for user {user_id}")
    try:
        profile = await social_service.create_user_profile(user_id, profile_data)
        return {"message": "Profile created/updated successfully", "profile": profile}
    except Exception as e:
        app_logger.error(f"Error creating/updating profile: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create/update profile")

@router.get("/profile/{user_id}")
async def get_user_profile(
    user_id: str,
    social_service: SocialTradingService = Depends()
):
    """
    Get user profile.
    
    Example: GET /social/profile/123
    """
    app_logger.info(f"Fetching profile for user {user_id}")
    try:
        profile = await social_service.get_user_profile(user_id)
        return {"message": "Profile retrieved successfully", "profile": profile}
    except Exception as e:
        app_logger.error(f"Error fetching profile: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve profile")

@router.post("/follow")
async def follow_user(
    follower_id: str,
    following_id: str,
    social_service: SocialTradingService = Depends()
):
    """
    Follow another user.
    
    Example: POST /social/follow?follower_id=123&following_id=456
    """
    app_logger.info(f"User {follower_id} following {following_id}")
    try:
        result = await social_service.follow_user(follower_id, following_id)
        return result
    except Exception as e:
        app_logger.error(f"Error following user: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to follow user")

@router.delete("/follow")
async def unfollow_user(
    follower_id: str,
    following_id: str,
    social_service: SocialTradingService = Depends()
):
    """
    Unfollow a user.
    
    Example: DELETE /social/follow?follower_id=123&following_id=456
    """
    app_logger.info(f"User {follower_id} unfollowing {following_id}")
    try:
        result = await social_service.unfollow_user(follower_id, following_id)
        return result
    except Exception as e:
        app_logger.error(f"Error unfollowing user: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to unfollow user")

@router.get("/following/{user_id}")
async def get_following(
    user_id: str,
    social_service: SocialTradingService = Depends()
):
    """
    Get users that a user is following.
    
    Example: GET /social/following/123
    """
    app_logger.info(f"Fetching following for user {user_id}")
    try:
        following = await social_service.get_following(user_id)
        return {"message": "Following retrieved successfully", "following": following}
    except Exception as e:
        app_logger.error(f"Error fetching following: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve following")

@router.get("/followers/{user_id}")
async def get_followers(
    user_id: str,
    social_service: SocialTradingService = Depends()
):
    """
    Get users that follow a user.
    
    Example: GET /social/followers/123
    """
    app_logger.info(f"Fetching followers for user {user_id}")
    try:
        followers = await social_service.get_followers(user_id)
        return {"message": "Followers retrieved successfully", "followers": followers}
    except Exception as e:
        app_logger.error(f"Error fetching followers: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve followers")

@router.get("/leaderboard")
async def get_leaderboard(
    timeframe: str = Query("monthly", description="Timeframe: daily, weekly, monthly, yearly"),
    limit: int = Query(50, description="Number of top performers to return"),
    social_service: SocialTradingService = Depends()
):
    """
    Get leaderboard of top performers.
    
    Example: GET /social/leaderboard?timeframe=monthly&limit=20
    """
    app_logger.info(f"Fetching {timeframe} leaderboard")
    try:
        leaderboard = await social_service.get_leaderboard(timeframe, limit)
        return {"message": "Leaderboard retrieved successfully", "leaderboard": leaderboard}
    except Exception as e:
        app_logger.error(f"Error fetching leaderboard: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve leaderboard")

@router.post("/discussions")
async def create_discussion(
    user_id: str,
    title: str,
    content: str,
    tags: List[str] = Query(None, description="Discussion tags"),
    social_service: SocialTradingService = Depends()
):
    """
    Create a new discussion post.
    
    Example: POST /social/discussions?user_id=123&title=Market Analysis&content=Great day for tech stocks&tags=analysis,tech
    """
    app_logger.info(f"Creating discussion by user {user_id}")
    try:
        discussion = await social_service.create_discussion(user_id, title, content, tags)
        return {"message": "Discussion created successfully", "discussion": discussion}
    except Exception as e:
        app_logger.error(f"Error creating discussion: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create discussion")

@router.get("/discussions")
async def get_discussions(
    limit: int = Query(20, description="Number of discussions to return"),
    tags: List[str] = Query(None, description="Filter by tags"),
    social_service: SocialTradingService = Depends()
):
    """
    Get recent discussions.
    
    Example: GET /social/discussions?limit=10&tags=analysis,tech
    """
    app_logger.info("Fetching discussions")
    try:
        discussions = await social_service.get_discussions(limit, tags)
        return {"message": "Discussions retrieved successfully", "discussions": discussions}
    except Exception as e:
        app_logger.error(f"Error fetching discussions: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve discussions")

@router.post("/discussions/{discussion_id}/like")
async def like_discussion(
    discussion_id: str,
    user_id: str,
    social_service: SocialTradingService = Depends()
):
    """
    Like a discussion.
    
    Example: POST /social/discussions/discussion_123/like?user_id=123
    """
    app_logger.info(f"User {user_id} liking discussion {discussion_id}")
    try:
        result = await social_service.like_discussion(discussion_id, user_id)
        return result
    except Exception as e:
        app_logger.error(f"Error liking discussion: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to like discussion")

@router.post("/discussions/{discussion_id}/comment")
async def comment_on_discussion(
    discussion_id: str,
    user_id: str,
    comment: str,
    social_service: SocialTradingService = Depends()
):
    """
    Add comment to discussion.
    
    Example: POST /social/discussions/discussion_123/comment?user_id=123&comment=Great analysis!
    """
    app_logger.info(f"User {user_id} commenting on discussion {discussion_id}")
    try:
        result = await social_service.comment_on_discussion(discussion_id, user_id, comment)
        return result
    except Exception as e:
        app_logger.error(f"Error commenting on discussion: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to add comment")

@router.post("/strategies")
async def create_trading_strategy(
    user_id: str,
    strategy_data: Dict[str, Any],
    social_service: SocialTradingService = Depends()
):
    """
    Create a trading strategy.
    
    Example: POST /social/strategies?user_id=123
    Body: {
        "name": "Momentum Strategy",
        "description": "Buy high momentum stocks",
        "strategy_type": "Momentum",
        "risk_level": "High"
    }
    """
    app_logger.info(f"Creating trading strategy for user {user_id}")
    try:
        strategy = await social_service.create_trading_strategy(user_id, strategy_data)
        return {"message": "Strategy created successfully", "strategy": strategy}
    except Exception as e:
        app_logger.error(f"Error creating strategy: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create strategy")

@router.get("/strategies")
async def get_strategies(
    user_id: str = Query(None, description="Filter by user ID"),
    public_only: bool = Query(True, description="Show only public strategies"),
    social_service: SocialTradingService = Depends()
):
    """
    Get trading strategies.
    
    Example: GET /social/strategies?user_id=123&public_only=true
    """
    app_logger.info("Fetching trading strategies")
    try:
        strategies = await social_service.get_strategies(user_id, public_only)
        return {"message": "Strategies retrieved successfully", "strategies": strategies}
    except Exception as e:
        app_logger.error(f"Error fetching strategies: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve strategies")

@router.post("/strategies/{strategy_id}/follow")
async def follow_strategy(
    strategy_id: str,
    user_id: str,
    social_service: SocialTradingService = Depends()
):
    """
    Follow a trading strategy.
    
    Example: POST /social/strategies/strategy_123/follow?user_id=123
    """
    app_logger.info(f"User {user_id} following strategy {strategy_id}")
    try:
        result = await social_service.follow_strategy(strategy_id, user_id)
        return result
    except Exception as e:
        app_logger.error(f"Error following strategy: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to follow strategy")

@router.get("/education")
async def get_educational_content(
    social_service: SocialTradingService = Depends()
):
    """
    Get educational content and tutorials.
    
    Example: GET /social/education
    """
    app_logger.info("Fetching educational content")
    try:
        content = await social_service.get_educational_content()
        return {"message": "Educational content retrieved", "content": content}
    except Exception as e:
        app_logger.error(f"Error fetching educational content: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve educational content")
