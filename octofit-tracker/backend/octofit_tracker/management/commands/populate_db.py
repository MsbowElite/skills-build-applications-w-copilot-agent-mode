from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from djongo import models

from django.conf import settings
from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Conectar ao MongoDB
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']

        # Limpar coleções
        db.users.delete_many({})
        db.teams.delete_many({})
        db.activities.delete_many({})
        db.leaderboard.delete_many({})
        db.workouts.delete_many({})

        # Criar times
        marvel = {'name': 'Team Marvel'}
        dc = {'name': 'Team DC'}
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

        # Criar atividades
        activities = [
            {'user_email': 'tony@marvel.com', 'activity': 'Running', 'duration': 30},
            {'user_email': 'steve@marvel.com', 'activity': 'Cycling', 'duration': 45},
            {'user_email': 'bruce@dc.com', 'activity': 'Swimming', 'duration': 60},
            {'user_email': 'clark@dc.com', 'activity': 'Flying', 'duration': 120},
        ]
        db.activities.insert_many(activities)

        # Criar leaderboard
        leaderboard = [
            {'user_email': 'tony@marvel.com', 'points': 100},
            {'user_email': 'steve@marvel.com', 'points': 90},
            {'user_email': 'bruce@dc.com', 'points': 110},
            {'user_email': 'clark@dc.com', 'points': 120},
        ]
        db.leaderboard.insert_many(leaderboard)

        # Criar sugestões de treino
        workouts = [
            {'user_email': 'tony@marvel.com', 'suggestion': '5km run'},
            {'user_email': 'steve@marvel.com', 'suggestion': '10km bike'},
            {'user_email': 'bruce@dc.com', 'suggestion': '1km swim'},
            {'user_email': 'clark@dc.com', 'suggestion': 'fly 10 laps'},
        ]
        db.workouts.insert_many(workouts)

        self.stdout.write(self.style.SUCCESS('octofit_db populado com dados de teste!'))
