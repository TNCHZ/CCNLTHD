# Generated by Django 5.1.2 on 2025-02-04 14:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0022_alter_user_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='itemsinlocker',
            name='status',
            field=models.BooleanField(choices=[(True, 'Đã lấy'), (False, 'Chưa lấy')], default=False),
        ),
    ]
