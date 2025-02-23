from flask import jsonify, request, render_template
from app import app, db
from models import GameScore

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/scores', methods=['POST'])
def save_score():
    data = request.json
    game_score = GameScore(
        score=data['score'],
        player_health=data['playerHealth'],
        warlord_health=data['warlordHealth'],
        arrows_shot=data['arrowsShot'],
        hits=data['hits']
    )
    db.session.add(game_score)
    db.session.commit()
    return jsonify({'message': 'Score saved successfully'}), 201

@app.route('/api/scores', methods=['GET'])
def get_scores():
    scores = GameScore.query.order_by(GameScore.score.desc()).limit(10).all()
    return jsonify([{
        'score': score.score,
        'created_at': score.created_at.isoformat(),
        'arrows_shot': score.arrows_shot,
        'hits': score.hits
    } for score in scores])