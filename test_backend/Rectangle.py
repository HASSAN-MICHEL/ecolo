class Rectangle:
    def __init__(self, largeur=0, hauteur=0):
        self.largeur = largeur
        self.hauteur = hauteur
    
    def get_largeur(self):
        return self.largeur
    
    def set_largeur(self, valeur):
        self.largeur = valeur
    
    def get_hauteur(self):
        return self.hauteur
    
    def set_hauteur(self, valeur):
        self.hauteur = valeur
    
    def perimetre(self):
        return 2 * (self.largeur + self.hauteur)
    
    def surface(self):
        return self.largeur * self.hauteur
    
    def afficher(self):
        print(f"Rectangle - Largeur: {self.largeur}, Hauteur: {self.hauteur}")
        print(f"Périmètre: {self.perimetre()}")
        print(f"Surface: {self.surface()}")


# Programme de test
if __name__ == "__main__":
    # Création de l'objet rectangle avec largeur=12 et hauteur=5
    rectangle1 = Rectangle(12, 5)
    
  
    rectangle1.afficher()
    
    
    print(f"Lecture largeur: {rectangle1.get_largeur()}")
    print(f"Lecture hauteur: {rectangle1.get_hauteur()}")
    
 
    rectangle1.set_largeur(8)
    rectangle1.set_hauteur(3)
    
    print("Modification effectuée: largeur=8, hauteur=3")
    rectangle1.afficher()
    
    
    print(f"Périmètre: {rectangle1.perimetre()}")
    print(f"Surface: {rectangle1.surface()}")