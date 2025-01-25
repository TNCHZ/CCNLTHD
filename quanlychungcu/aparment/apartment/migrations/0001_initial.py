# Generated by Django 5.1.2 on 2025-01-24 14:13

import ckeditor.fields
import cloudinary.models
import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('avatar', cloudinary.models.CloudinaryField(max_length=255, null=True, verbose_name='avatar')),
                ('groups', models.ManyToManyField(blank=True, related_name='apartment_user_groups', to='auth.group')),
                ('user_permissions', models.ManyToManyField(blank=True, related_name='apartment_user_permissions', to='auth.permission')),
            ],
            options={
                'ordering': ['id'],
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
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
                'ordering': ['-id'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Locker',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('name', models.TextField()),
                ('status', models.BooleanField(choices=[(True, 'Không có đồ cần lấy'), (False, 'Có đồ cần lấy')], default=True)),
            ],
            options={
                'ordering': ['-id'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('name', models.CharField(max_length=50, unique=True)),
            ],
            options={
                'ordering': ['-id'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Survey',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('name', models.TextField()),
                ('content', ckeditor.fields.RichTextField(blank=True)),
            ],
            options={
                'ordering': ['-id'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='apartment.user')),
            ],
            options={
                'ordering': ['user'],
            },
        ),
        migrations.CreateModel(
            name='Resident',
            fields=[
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='apartment.user')),
                ('gender', models.BooleanField(choices=[(True, 'Male'), (False, 'Female')], default=True)),
                ('day_of_birth', models.DateField()),
                ('address', models.TextField()),
                ('phone', models.IntegerField(unique=True)),
                ('citizen_identification', models.CharField(blank=True, max_length=12)),
                ('change_password_image', models.BooleanField(default=False)),
            ],
            options={
                'ordering': ['user'],
            },
        ),
        migrations.CreateModel(
            name='ItemsInLocker',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('name', models.TextField()),
                ('locker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apartment.locker')),
            ],
            options={
                'ordering': ['-id'],
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='user',
            name='role',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apartment.role'),
        ),
        migrations.CreateModel(
            name='SurveyResident',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('response_content', ckeditor.fields.RichTextField(blank=True)),
                ('survey', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apartment.survey')),
                ('resident', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apartment.resident')),
            ],
            options={
                'unique_together': {('survey', 'resident')},
            },
        ),
        migrations.AddField(
            model_name='survey',
            name='residents',
            field=models.ManyToManyField(blank=True, related_name='surveys', through='apartment.SurveyResident', to='apartment.resident'),
        ),
        migrations.CreateModel(
            name='ServiceFees',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('name', models.TextField()),
                ('image', cloudinary.models.CloudinaryField(blank=True, max_length=255, null=True, verbose_name='fee')),
                ('status', models.BooleanField(choices=[(True, 'Đã thanh toán'), (False, 'Chưa thanh toán')], default=False)),
                ('fee_value', models.FloatField(blank=True)),
                ('resident', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apartment.resident')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ParkingForRelatives',
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
                'ordering': ['-id'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ParkingFees',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('name', models.TextField()),
                ('image', cloudinary.models.CloudinaryField(blank=True, max_length=255, null=True, verbose_name='fee')),
                ('status', models.BooleanField(choices=[(True, 'Đã thanh toán'), (False, 'Chưa thanh toán')], default=False)),
                ('fee_value', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apartment.feevalue')),
                ('resident', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apartment.resident')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ManagingFees',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('name', models.TextField()),
                ('image', cloudinary.models.CloudinaryField(blank=True, max_length=255, null=True, verbose_name='fee')),
                ('status', models.BooleanField(choices=[(True, 'Đã thanh toán'), (False, 'Chưa thanh toán')], default=False)),
                ('fee_value', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apartment.feevalue')),
                ('resident', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apartment.resident')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='locker',
            name='resident',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apartment.resident'),
        ),
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('title', models.TextField()),
                ('content', ckeditor.fields.RichTextField(blank=True)),
                ('resident', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='apartment.resident')),
            ],
            options={
                'ordering': ['-id'],
                'abstract': False,
            },
        ),
    ]
