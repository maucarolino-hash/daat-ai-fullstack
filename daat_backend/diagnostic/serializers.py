from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile, WebhookConfig

User = get_user_model()

class WebhookSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebhookConfig
        fields = ['id', 'name', 'url', 'platform', 'is_active', 'events', 'created_at']
        read_only_fields = ['id', 'created_at']

from .models import Diagnostic

class DiagnosticSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnostic
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'score', 'feedback', 'result']
class UserCreditsSerializer(serializers.ModelSerializer):
    credits = serializers.IntegerField(source='profile.credits', read_only=True)
    is_premium = serializers.BooleanField(source='profile.is_premium', read_only=True)
    company = serializers.CharField(source='profile.company', required=False, allow_blank=True)
    role = serializers.CharField(source='profile.role', required=False, allow_blank=True)
    full_name = serializers.SerializerMethodField()
    # Write-only field to accept full_name updates
    full_name_update = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('pk', 'username', 'email', 'first_name', 'last_name', 'full_name', 'full_name_update', 'credits', 'is_premium', 'company', 'role')
        read_only_fields = ('email', 'credits', 'is_premium')

    def get_full_name(self, obj):
        return obj.get_full_name().strip() or obj.username

    def update(self, instance, validated_data):
        # Handle Nested Profile Data
        profile_data = {}
        if 'profile' in validated_data:
            profile_data = validated_data.pop('profile')
        
        # Handle Full Name Splitting
        if 'full_name_update' in validated_data:
            full_name = validated_data.pop('full_name_update')
            if full_name:
                parts = full_name.split(' ', 1)
                instance.first_name = parts[0]
                instance.last_name = parts[1] if len(parts) > 1 else ''

        # Update User Standard Fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update Profile Fields
        profile = instance.profile
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        return instance

from .models import AnalysisFeedback

class AnalysisFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisFeedback
        fields = '__all__'
        read_only_fields = ['created_at']
