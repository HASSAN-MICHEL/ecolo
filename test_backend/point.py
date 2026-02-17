class Point:
    def __init__(self, x=0.0, y=0.0):
        self.x = x 
        self.y = y
    
    def get_x(self):
        return self.x
    
    def get_y(self):
        return self.y
    
    def set_x(self, x):
        self.x = x
    
    def set_y(self, y):
        self.y = y
    
    def deplacer(self, dx, dy):
        self.x += dx
        self.y += dy
    
    def afficher(self):
        """Affiche les coordonnées cartésiennes du point"""
        print(f"Point: ({self.x}, {self.y})")
    
    def saisir(self):
        """Ici je vais si=aisir les coordonné de mon point """
        try:
            x = float(input("Entrez la coordonnée DE x: "))
            y = float(input("Entrez la coordonnée  DE y: "))
            self.set_x(x)
            self.set_y(y)
    
        except ValueError:
            print("Erreur: Veuillez entrer des nombres valides.")
    
    def calculDistance(self, autre_point):
      
        dx = self.x - autre_point.get_x()
        dy = self.y - autre_point.get_y()
        return (dx**2 + dy**2)**0.5
    
    def calculMilieu(self, autre_point):
        
        mx = (self.x + autre_point.get_x()) / 2
        my = (self.y + autre_point.get_y()) / 2
        return Point(mx, my)

# UTILISATION 
if __name__ == "__main__":
    A = Point(3, 2)
    B = Point(-4 , 8 )  # utilise les valeurs par défaut
    
    C = Point(6 , -1)
    
    print("Premier point: ", end="")
    A.afficher()
    print("Deuxième point: ", end="")
    B.afficher()
    C.afficher()
    
   
    
    # Translation
    C.deplacer(1.5, -0.5)
   
    
    print("Après modification:")
    C.afficher()
 
 
    # Utilisation des mutateurs
    C.set_x(-4)
    C.set_y(3)
    
    # Test distance
    distance = A.calculDistance(B)
    print(f"Distance entre A et B: {distance:.2f}")
    
    # Test milieu
    milieu = A.calculMilieu(B)
    print("Milieu du segment AB: ", end="")
    milieu.afficher()
    
    
