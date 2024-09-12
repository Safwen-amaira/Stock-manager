from django.db import models

# Create your models here.
class Credit (models.Model): 
    profitaire = models.CharField (max_length=255,blank=False)
    valeur =  models.FloatField()
    type = models.CharField(max_length=255)
    is_Money =models.BooleanField(default=True)
    is_Products= models.BooleanField(default=False)
    date = models.DateField(auto_now=True)
    ToPayBefore = models.DateField(auto_now_add=True)    

    def __str__(self):
        return f"Credit {self.id} - {self.profitaire} ({self.type} pcs)"
