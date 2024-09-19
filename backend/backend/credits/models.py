from django.db import models
import django.utils.timezone
# Create your models here.
class Credit (models.Model): 
    profitaire = models.CharField(max_length=255,default='None') 
    credit_payer = models.CharField(max_length=255,default='None')
    credit_value = models.CharField(max_length=500,default='None') 
    is_Money = models.BooleanField(default = True ) 
    toPayBefore = models.DateField(null=True)
    comments = models.CharField(max_length=2500,default='None')
    otherSidePhone= models.CharField(max_length=255,default='None')
    otherSideEmail = models.EmailField(default='None@none.com')
    otherSideAdress = models.CharField(max_length=500,default='None')
    hePaysForUs = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Credit {self.id} - {self.profitaire} ({self.type} pcs)"
