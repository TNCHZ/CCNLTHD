# Generated by Django 5.1.2 on 2025-01-22 16:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0016_alter_surveyresident_unique_together'),
    ]

    operations = [
        migrations.AddField(
            model_name='locker',
            name='status',
            field=models.BooleanField(choices=[(True, 'Không có đồ cần lấy'), (False, 'Có đồ cần lấy')], default=True),
        ),
    ]
