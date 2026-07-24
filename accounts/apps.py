from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        from django.conf import settings
        from django.contrib.auth import get_user_model

        User = get_user_model()
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'Admin@123!')
            admin_user = User.objects.get(username='admin')
            admin_user.role = 'ADMIN'
            admin_user.save(update_fields=['role'])
