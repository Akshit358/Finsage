"""
Social Trading Service
Provides social trading features, user profiles, and community features
"""

import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import random
from app.core.logger import app_logger

class SocialTradingService:
    def __init__(self):
        app_logger.info("Initializing Social Trading Service...")
        self.users = {}
        self.follows = {}
        self.leaderboard = {}
        self.discussions = {}
        self.strategies = {}
        app_logger.info("Social Trading Service initialized.")

    async def create_user_profile(self, user_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create or update user profile"""
        app_logger.info(f"Creating/updating profile for user {user_id}")
        
        profile = {
            "user_id": user_id,
            "username": profile_data.get("username", f"user_{user_id}"),
            "display_name": profile_data.get("display_name", "Trader"),
            "bio": profile_data.get("bio", ""),
            "investment_style": profile_data.get("investment_style", "Balanced"),
            "risk_tolerance": profile_data.get("risk_tolerance", "Medium"),
            "experience_level": profile_data.get("experience_level", "Intermediate"),
            "favorite_sectors": profile_data.get("favorite_sectors", []),
            "avatar_url": profile_data.get("avatar_url", ""),
            "join_date": datetime.now().isoformat(),
            "followers_count": 0,
            "following_count": 0,
            "total_return": 0.0,
            "win_rate": 0.0,
            "total_trades": 0,
            "verified": False,
            "badges": []
        }
        
        self.users[user_id] = profile
        return profile

    async def get_user_profile(self, user_id: str) -> Dict[str, Any]:
        """Get user profile"""
        app_logger.info(f"Fetching profile for user {user_id}")
        
        if user_id not in self.users:
            return {"error": "User not found"}
        
        profile = self.users[user_id].copy()
        
        # Add performance metrics
        profile["performance"] = await self._calculate_user_performance(user_id)
        profile["recent_activity"] = await self._get_recent_activity(user_id)
        
        return profile

    async def follow_user(self, follower_id: str, following_id: str) -> Dict[str, Any]:
        """Follow another user"""
        app_logger.info(f"User {follower_id} following {following_id}")
        
        if follower_id not in self.follows:
            self.follows[follower_id] = []
        
        if following_id not in self.follows[follower_id]:
            self.follows[follower_id].append(following_id)
            
            # Update follower counts
            if follower_id in self.users:
                self.users[follower_id]["following_count"] = len(self.follows[follower_id])
            if following_id in self.users:
                self.users[following_id]["followers_count"] += 1
        
        return {"message": "Successfully followed user", "following_id": following_id}

    async def unfollow_user(self, follower_id: str, following_id: str) -> Dict[str, Any]:
        """Unfollow a user"""
        app_logger.info(f"User {follower_id} unfollowing {following_id}")
        
        if follower_id in self.follows and following_id in self.follows[follower_id]:
            self.follows[follower_id].remove(following_id)
            
            # Update follower counts
            if follower_id in self.users:
                self.users[follower_id]["following_count"] = len(self.follows[follower_id])
            if following_id in self.users:
                self.users[following_id]["followers_count"] -= 1
        
        return {"message": "Successfully unfollowed user", "following_id": following_id}

    async def get_following(self, user_id: str) -> Dict[str, Any]:
        """Get users that a user is following"""
        app_logger.info(f"Fetching following for user {user_id}")
        
        following_ids = self.follows.get(user_id, [])
        following_users = []
        
        for following_id in following_ids:
            if following_id in self.users:
                user = self.users[following_id].copy()
                user["performance"] = await self._calculate_user_performance(following_id)
                following_users.append(user)
        
        return {
            "following": following_users,
            "count": len(following_users),
            "timestamp": datetime.now().isoformat()
        }

    async def get_followers(self, user_id: str) -> Dict[str, Any]:
        """Get users that follow a user"""
        app_logger.info(f"Fetching followers for user {user_id}")
        
        followers = []
        for follower_id, following_list in self.follows.items():
            if user_id in following_list and follower_id in self.users:
                user = self.users[follower_id].copy()
                user["performance"] = await self._calculate_user_performance(follower_id)
                followers.append(user)
        
        return {
            "followers": followers,
            "count": len(followers),
            "timestamp": datetime.now().isoformat()
        }

    async def get_leaderboard(self, timeframe: str = "monthly", limit: int = 50) -> Dict[str, Any]:
        """Get leaderboard of top performers"""
        app_logger.info(f"Fetching {timeframe} leaderboard")
        
        # Generate mock performance data
        leaderboard_data = []
        for user_id, user in self.users.items():
            performance = await self._calculate_user_performance(user_id)
            leaderboard_data.append({
                "user_id": user_id,
                "username": user["username"],
                "display_name": user["display_name"],
                "total_return": performance["total_return"],
                "win_rate": performance["win_rate"],
                "sharpe_ratio": performance["sharpe_ratio"],
                "total_trades": performance["total_trades"],
                "rank": 0  # Will be set after sorting
            })
        
        # Sort by total return
        leaderboard_data.sort(key=lambda x: x["total_return"], reverse=True)
        
        # Assign ranks
        for i, user in enumerate(leaderboard_data[:limit]):
            user["rank"] = i + 1
        
        return {
            "leaderboard": leaderboard_data[:limit],
            "timeframe": timeframe,
            "total_users": len(leaderboard_data),
            "timestamp": datetime.now().isoformat()
        }

    async def create_discussion(self, user_id: str, title: str, content: str, 
                               tags: List[str] = None) -> Dict[str, Any]:
        """Create a new discussion post"""
        app_logger.info(f"Creating discussion by user {user_id}")
        
        discussion_id = f"discussion_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        discussion = {
            "discussion_id": discussion_id,
            "user_id": user_id,
            "username": self.users.get(user_id, {}).get("username", "Unknown"),
            "title": title,
            "content": content,
            "tags": tags or [],
            "created_at": datetime.now().isoformat(),
            "likes": 0,
            "comments": 0,
            "views": 0,
            "pinned": False
        }
        
        self.discussions[discussion_id] = discussion
        return discussion

    async def get_discussions(self, limit: int = 20, tags: List[str] = None) -> Dict[str, Any]:
        """Get recent discussions"""
        app_logger.info("Fetching discussions")
        
        discussions = list(self.discussions.values())
        
        # Filter by tags if provided
        if tags:
            discussions = [d for d in discussions if any(tag in d["tags"] for tag in tags)]
        
        # Sort by creation date
        discussions.sort(key=lambda x: x["created_at"], reverse=True)
        
        return {
            "discussions": discussions[:limit],
            "total_count": len(discussions),
            "timestamp": datetime.now().isoformat()
        }

    async def like_discussion(self, discussion_id: str, user_id: str) -> Dict[str, Any]:
        """Like a discussion"""
        app_logger.info(f"User {user_id} liking discussion {discussion_id}")
        
        if discussion_id in self.discussions:
            self.discussions[discussion_id]["likes"] += 1
            return {"message": "Discussion liked successfully"}
        
        return {"error": "Discussion not found"}

    async def comment_on_discussion(self, discussion_id: str, user_id: str, 
                                   comment: str) -> Dict[str, Any]:
        """Add comment to discussion"""
        app_logger.info(f"User {user_id} commenting on discussion {discussion_id}")
        
        if discussion_id in self.discussions:
            self.discussions[discussion_id]["comments"] += 1
            return {"message": "Comment added successfully"}
        
        return {"error": "Discussion not found"}

    async def create_trading_strategy(self, user_id: str, strategy_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a trading strategy"""
        app_logger.info(f"Creating trading strategy for user {user_id}")
        
        strategy_id = f"strategy_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        strategy = {
            "strategy_id": strategy_id,
            "user_id": user_id,
            "username": self.users.get(user_id, {}).get("username", "Unknown"),
            "name": strategy_data.get("name", "My Strategy"),
            "description": strategy_data.get("description", ""),
            "strategy_type": strategy_data.get("strategy_type", "Momentum"),
            "risk_level": strategy_data.get("risk_level", "Medium"),
            "timeframe": strategy_data.get("timeframe", "Daily"),
            "indicators": strategy_data.get("indicators", []),
            "entry_rules": strategy_data.get("entry_rules", []),
            "exit_rules": strategy_data.get("exit_rules", []),
            "created_at": datetime.now().isoformat(),
            "followers": 0,
            "performance": {
                "total_return": 0.0,
                "win_rate": 0.0,
                "max_drawdown": 0.0,
                "sharpe_ratio": 0.0
            },
            "public": strategy_data.get("public", True)
        }
        
        self.strategies[strategy_id] = strategy
        return strategy

    async def get_strategies(self, user_id: str = None, public_only: bool = True) -> Dict[str, Any]:
        """Get trading strategies"""
        app_logger.info("Fetching trading strategies")
        
        strategies = list(self.strategies.values())
        
        # Filter by user if specified
        if user_id:
            strategies = [s for s in strategies if s["user_id"] == user_id]
        
        # Filter public strategies if requested
        if public_only:
            strategies = [s for s in strategies if s["public"]]
        
        # Sort by performance
        strategies.sort(key=lambda x: x["performance"]["total_return"], reverse=True)
        
        return {
            "strategies": strategies,
            "total_count": len(strategies),
            "timestamp": datetime.now().isoformat()
        }

    async def follow_strategy(self, strategy_id: str, user_id: str) -> Dict[str, Any]:
        """Follow a trading strategy"""
        app_logger.info(f"User {user_id} following strategy {strategy_id}")
        
        if strategy_id in self.strategies:
            self.strategies[strategy_id]["followers"] += 1
            return {"message": "Strategy followed successfully"}
        
        return {"error": "Strategy not found"}

    async def get_educational_content(self) -> Dict[str, Any]:
        """Get educational content and tutorials"""
        app_logger.info("Fetching educational content")
        
        content = [
            {
                "id": "tutorial_1",
                "title": "Introduction to Technical Analysis",
                "type": "Tutorial",
                "difficulty": "Beginner",
                "duration": "30 minutes",
                "description": "Learn the basics of technical analysis and chart reading",
                "topics": ["Chart Patterns", "Support/Resistance", "Trend Lines"],
                "rating": 4.8,
                "students": 1250
            },
            {
                "id": "tutorial_2",
                "title": "Options Trading Strategies",
                "type": "Course",
                "difficulty": "Advanced",
                "duration": "2 hours",
                "description": "Master advanced options trading strategies",
                "topics": ["Covered Calls", "Straddles", "Iron Condors"],
                "rating": 4.9,
                "students": 890
            },
            {
                "id": "webinar_1",
                "title": "Market Outlook 2024",
                "type": "Webinar",
                "difficulty": "Intermediate",
                "duration": "1 hour",
                "description": "Expert analysis of market trends and predictions",
                "topics": ["Market Analysis", "Sector Rotation", "Economic Indicators"],
                "rating": 4.7,
                "students": 2100
            }
        ]
        
        return {
            "content": content,
            "total_count": len(content),
            "timestamp": datetime.now().isoformat()
        }

    async def _calculate_user_performance(self, user_id: str) -> Dict[str, Any]:
        """Calculate user performance metrics"""
        # Mock performance calculation
        return {
            "total_return": round(random.uniform(-20, 50), 2),
            "win_rate": round(random.uniform(40, 80), 2),
            "sharpe_ratio": round(random.uniform(0.5, 2.5), 2),
            "max_drawdown": round(random.uniform(-30, -5), 2),
            "total_trades": random.randint(50, 500),
            "avg_trade_return": round(random.uniform(-2, 5), 2),
            "best_trade": round(random.uniform(10, 50), 2),
            "worst_trade": round(random.uniform(-20, -5), 2)
        }

    async def _get_recent_activity(self, user_id: str) -> List[Dict[str, Any]]:
        """Get recent user activity"""
        activities = [
            {
                "type": "trade",
                "description": "Bought 100 shares of AAPL",
                "timestamp": (datetime.now() - timedelta(hours=2)).isoformat()
            },
            {
                "type": "post",
                "description": "Posted discussion: Market Analysis",
                "timestamp": (datetime.now() - timedelta(hours=5)).isoformat()
            },
            {
                "type": "strategy",
                "description": "Created new strategy: Momentum Trading",
                "timestamp": (datetime.now() - timedelta(days=1)).isoformat()
            }
        ]
        
        return activities

