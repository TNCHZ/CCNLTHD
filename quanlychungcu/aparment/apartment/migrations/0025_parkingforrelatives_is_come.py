# Generated by Django 5.1.2 on 2025-02-04 16:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0024_remove_locker_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='parkingforrelatives',
            name='is_come',
            field=models.BooleanField(choices=[(True, 'Đã đến'), (False, 'Chưa đến')], default=False),
        ),
    ]
