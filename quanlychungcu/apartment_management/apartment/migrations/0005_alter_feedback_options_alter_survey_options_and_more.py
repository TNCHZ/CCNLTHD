# Generated by Django 5.1.2 on 2025-01-14 03:57

import ckeditor.fields
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0004_merge_20250114_1008'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='feedback',
            options={'ordering': ['id']},
        ),
        migrations.AlterModelOptions(
            name='survey',
            options={'ordering': ['id']},
        ),
        migrations.RemoveField(
            model_name='locker',
            name='items',
        ),
        migrations.RemoveField(
            model_name='survey',
            name='resident',
        ),
        migrations.AddField(
            model_name='itemsinlocker',
            name='locker',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='apartment.locker'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='feedback',
            name='content',
            field=ckeditor.fields.RichTextField(blank=True),
        ),
        migrations.AlterField(
            model_name='survey',
            name='content',
            field=ckeditor.fields.RichTextField(blank=True, default=2),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='SurveyResident',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('response_content', ckeditor.fields.RichTextField(blank=True)),
                ('resident', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apartment.resident')),
                ('survey', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apartment.survey')),
            ],
        ),
        migrations.AddField(
            model_name='survey',
            name='residents',
            field=models.ManyToManyField(blank=True, related_name='surveys', through='apartment.SurveyResident', to='apartment.resident'),
        ),
    ]
