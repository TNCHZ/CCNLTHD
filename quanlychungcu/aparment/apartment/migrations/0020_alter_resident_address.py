# Generated by Django 5.1.2 on 2025-02-03 18:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0019_remove_feedback_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resident',
            name='address',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='apartment.address'),
        ),
    ]
