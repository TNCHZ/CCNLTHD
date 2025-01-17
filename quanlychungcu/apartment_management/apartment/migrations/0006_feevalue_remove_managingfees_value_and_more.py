# Generated by Django 5.1.2 on 2025-01-14 13:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0005_alter_feedback_options_alter_survey_options_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='FeeValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('name', models.TextField()),
                ('value', models.FloatField()),
            ],
            options={
                'ordering': ['id'],
                'abstract': False,
            },
        ),
        migrations.RemoveField(
            model_name='managingfees',
            name='value',
        ),
        migrations.RemoveField(
            model_name='parkingfees',
            name='value',
        ),
        migrations.RemoveField(
            model_name='servicefees',
            name='value',
        ),
        migrations.AddField(
            model_name='managingfees',
            name='fee_value',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='apartment.feevalue'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='parkingfees',
            name='fee_value',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='apartment.feevalue'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='servicefees',
            name='fee_value',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='apartment.feevalue'),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='ParkingFeeForRelatives',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('name_relative', models.TextField()),
                ('phone_relative', models.IntegerField(unique=True)),
                ('resident', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apartment.resident')),
            ],
            options={
                'ordering': ['id'],
                'abstract': False,
            },
        ),
    ]
