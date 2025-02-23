from datetime import datetime
from app import db

class GameScore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, nullable=False)
    player_health = db.Column(db.Integer, nullable=False)
    warlord_health = db.Column(db.Integer, nullable=False)
    arrows_shot = db.Column(db.Integer, nullable=False, default=0)
    hits = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
