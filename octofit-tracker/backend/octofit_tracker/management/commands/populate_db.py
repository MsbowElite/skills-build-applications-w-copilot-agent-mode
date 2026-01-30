from django.core.management.base import BaseCommand
from pymongo import MongoClient
import os

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Conectar ao MongoDB usando variáveis de ambiente
        mongo_host = os.environ.get('MONGODB_HOST', 'localhost')
        mongo_port = int(os.environ.get('MONGODB_PORT', '27017'))
        mongo_db_name = os.environ.get('MONGODB_DB_NAME', 'octofit_db')
        client = MongoClient(mongo_host, mongo_port)
        db = client[mongo_db_name]

        # Limpar coleções
        db.users.delete_many({})
        db.teams.delete_many({})
        db.activities.delete_many({})
        db.leaderboard.delete_many({})
        db.workouts.delete_many({})

        # Criar times com todos os campos esperados pelo frontend
        from datetime import datetime
        marvel = {
            'name': 'Team Marvel',
            'description': 'Earth\'s Mightiest Heroes team dedicated to protecting the world',
            'captain': 'Tony Stark',
            'members_count': 2,
            'created_at': '2024-01-01T00:00:00Z'
        }
        dc = {
            'name': 'Team DC',
            'description': 'Justice League defenders fighting for truth and justice',
            'captain': 'Bruce Wayne',
            'members_count': 2,
            'created_at': '2024-01-01T00:00:00Z'
        }
        marvel_id = db.teams.insert_one(marvel).inserted_id
        dc_id = db.teams.insert_one(dc).inserted_id

        # Criar usuários
        users = [
            {'name': 'Tony Stark', 'email': 'tony@marvel.com', 'team_id': marvel_id},
            {'name': 'Steve Rogers', 'email': 'steve@marvel.com', 'team_id': marvel_id},
            {'name': 'Bruce Wayne', 'email': 'bruce@dc.com', 'team_id': dc_id},
            {'name': 'Clark Kent', 'email': 'clark@dc.com', 'team_id': dc_id},
        ]
        db.users.insert_many(users)

        # Criar índice único para email
        db.users.create_index([('email', 1)], unique=True)

        # Criar atividades com todos os campos esperados pelo frontend
        activities = [
            {
                'id': 1,
                'user_email': 'tony@marvel.com',
                'user': 'Tony Stark',
                'activity': 'Running',
                'activity_type': 'Running',
                'duration': 30,
                'distance': 5,
                'calories': 300,
                'date': '2024-01-01T09:00:00Z',
            },
            {
                'id': 2,
                'user_email': 'steve@marvel.com',
                'user': 'Steve Rogers',
                'activity': 'Cycling',
                'activity_type': 'Cycling',
                'duration': 45,
                'distance': 15,
                'calories': 400,
                'date': '2024-01-02T09:00:00Z',
            },
            {
                'id': 3,
                'user_email': 'bruce@dc.com',
                'user': 'Bruce Wayne',
                'activity': 'Swimming',
                'activity_type': 'Swimming',
                'duration': 60,
                'distance': 2,
                'calories': 500,
                'date': '2024-01-03T09:00:00Z',
            },
            {
                'id': 4,
                'user_email': 'clark@dc.com',
                'user': 'Clark Kent',
                'activity': 'Flying',
                'activity_type': 'Flying',
                'duration': 120,
                'distance': 50,
                'calories': 800,
                'date': '2024-01-04T09:00:00Z',
            },
        ]
        db.activities.insert_many(activities)

        # Criar leaderboard com todos os campos esperados pelo frontend
        # Mapeia pontos por email para construir o schema esperado
        users_data = [
            {'email': 'tony@marvel.com', 'name': 'Tony Stark', 'team': 'Team Marvel', 'points': 100},
            {'email': 'steve@marvel.com', 'name': 'Steve Rogers', 'team': 'Team Marvel', 'points': 90},
            {'email': 'bruce@dc.com', 'name': 'Bruce Wayne', 'team': 'Team DC', 'points': 110},
            {'email': 'clark@dc.com', 'name': 'Clark Kent', 'team': 'Team DC', 'points': 120},
        ]

        leaderboard = []
        for idx, user_data in enumerate(users_data, start=1):
            email = user_data['email']
            # Contar quantas atividades o usuário possui
            activities_count = db.activities.count_documents({'user_email': email})

            leaderboard.append({
                'id': idx,
                'user': user_data['name'],
                'team': user_data['team'],
                'total_points': user_data['points'],
                'activities_count': activities_count,
            })
        
        db.leaderboard.insert_many(leaderboard)

        # Criar sugestões de treino / workouts com o schema esperado pelo frontend
        workouts = [
            {
                'id': 1,
                'user_email': 'tony@marvel.com',
                'suggestion': '5km run',
                'name': '5km Run',
                'description': 'Corrida de 5km em ritmo confortável para melhorar a resistência.',
                'workout_type': 'Cardio',
                'duration': 30,  # minutos
                'difficulty_level': 'Intermediate',
                'calories_burned': 300,
            },
            {
                'id': 2,
                'user_email': 'steve@marvel.com',
                'suggestion': '10km bike',
                'name': '10km Bike',
                'description': 'Pedalada de 10km em ritmo moderado para fortalecer pernas e cardio.',
                'workout_type': 'Cardio',
                'duration': 40,  # minutos
                'difficulty_level': 'Intermediate',
                'calories_burned': 400,
            },
            {
                'id': 3,
                'user_email': 'bruce@dc.com',
                'suggestion': '1km swim',
                'name': '1km Swim',
                'description': 'Nado de 1km focado em técnica e resistência muscular.',
                'workout_type': 'Cardio',
                'duration': 30,  # minutos
                'difficulty_level': 'Advanced',
                'calories_burned': 350,
            },
            {
                'id': 4,
                'user_email': 'clark@dc.com',
                'suggestion': 'fly 10 laps',
                'name': '10 Laps Flight',
                'description': '10 voltas de voo em alta velocidade para super-heróis kryptonianos.',
                'workout_type': 'Cardio',
                'duration': 20,  # minutos
                'difficulty_level': 'Expert',
                'calories_burned': 500,
            },
        ]
        db.workouts.insert_many(workouts)

        self.stdout.write(self.style.SUCCESS('octofit_db populado com dados de teste!'))
