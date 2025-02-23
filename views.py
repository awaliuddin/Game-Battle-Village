from flask import jsonify, request, render_template
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, db
from models import User, GameScore

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400

    user = User(username=username)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Registration successful', 'username': username}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        return jsonify({'message': 'Login successful', 'username': username}), 200

    return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/api/scores', methods=['POST'])
def save_score():
    data = request.json
    username = data.get('username')
    if not username:
        return jsonify({'message': 'User not authenticated'}), 401

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    game_score = GameScore(
        score=data['score'],
        player_health=data['playerHealth'],
        warlord_health=data['warlordHealth'],
        arrows_shot=data['arrowsShot'],
        hits=data['hits'],
        user_id=user.id
    )
    db.session.add(game_score)
    db.session.commit()
    return jsonify({'message': 'Score saved successfully'}), 201

@app.route('/api/scores', methods=['GET'])
def get_scores():
    scores = (GameScore.query
             .join(User)
             .add_columns(User.username)
             .order_by(GameScore.score.desc())
             .limit(10)
             .all())

    return jsonify([{
        'username': username,
        'score': score.score,
        'created_at': score.created_at.isoformat(),
        'arrows_shot': score.arrows_shot,
        'hits': score.hits
    } for score, username in scores])