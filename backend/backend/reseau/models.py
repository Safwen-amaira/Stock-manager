from django.db import models


class Reseau (models.Model):
    nom = models.CharField(max_length=255, default="none")
    relation = models.CharField(max_length=255,default = 'partner')
    is_contract = models.BooleanField(default=True)
    contract_begin = models.DateField(auto_now=True)
    contract_end = models.DateField (blank=True)
    num_tel = models.CharField(max_length=200) 
    num_fax = models.CharField(max_length=255) 
    email = models.EmailField()
    adresse = models.CharField(max_length=255,blank=False)
    webSite= models.CharField (max_length=255,null=True)
    logo = models.ImageField(upload_to='partnerslogo/', blank=True, null=True)

    def __str__(self):
        return f"{self.nom} - {self.relation} "
