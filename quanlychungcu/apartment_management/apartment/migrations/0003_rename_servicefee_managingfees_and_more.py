# Generated by Django 5.1.2 on 2025-01-11 14:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('apartment', '0002_rename_orderservicefee_servicefee_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='ManagingFee',
            new_name='ManagingFees',
        ),
        migrations.RenameModel(
            old_name='ParkingFee',
            new_name='ParkingFees',
        ),
        migrations.RenameModel(
            old_name='ServiceFee',
            new_name='ServiceFees',
        ),
    ]
