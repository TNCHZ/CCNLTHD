# Generated by Django 5.1.2 on 2025-01-21 17:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0010_alter_itemsinlocker_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resident',
            name='citizen_identification',
            field=models.CharField(blank=True, max_length=12),
        ),
    ]
