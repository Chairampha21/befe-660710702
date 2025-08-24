package main

import (
    "fmt"
    "net/http"
    "github.com/gin-gonic/gin"
)

// Shop struct
type Shop struct {
    ID    string `json:"id"`
    Name  string `json:"name"`
    Phone string `json:"phone"`
}

// Mobile struct
type Mobile struct {
    ID     string  `json:"id"`
    Brand  string  `json:"brand"`
    Model  string  `json:"model"`
    Price  float64 `json:"price"`
}


var shops = []Shop{
    {ID: "1", Name: "Mobile Plaza",     Phone: "089-123-4567"},
    {ID: "2", Name: "Gadget World",     Phone: "088-222-3333"},
    {ID: "3", Name: "Smartphone Mart",  Phone: "081-454-8899"},
    {ID: "4", Name: "Tech Corner",      Phone: "085-345-6789"},
    {ID: "5", Name: "Phone Express",    Phone: "094-567-3456"},
}


var mobiles = []Mobile{
    {ID: "1", Brand: "Apple",   Model: "iPhone 14 Pro", Price: 43900},
    {ID: "2", Brand: "Samsung", Model: "Galaxy S23",    Price: 32900},
    {ID: "3", Brand: "Oppo",    Model: "Reno 8T",       Price: 12999},
    {ID: "4", Brand: "Xiaomi",  Model: "13 Pro",        Price: 28900},
    {ID: "5", Brand: "Vivo",    Model: "V27 5G",        Price: 16999},
}

func getShops(c *gin.Context){
	idQuery := c.Query("id")

	if idQuery != ""{
		filter := []Shop{}
		for _, Shop := range shops{
			if fmt.Sprint(Shop.ID) == idQuery{
				filter = append(filter, Shop)
			}
		}
		c.JSON(http.StatusOK, filter)
		return
		
	}
	c.JSON(http.StatusOK, shops)
}

func getMobiles(c *gin.Context){
	brandQuery := c.Query("brand")

	if brandQuery != ""{
		filter := []Mobile{}
		for _, Mobile := range mobiles{
			if fmt.Sprint(Mobile.Brand) == brandQuery{
				filter = append(filter, Mobile)
			}
		}
		c.JSON(http.StatusOK, filter)
		return
		
	}
	c.JSON(http.StatusOK, mobiles)
}

func main() {
    r := gin.Default()
    
    r.GET("/station", func(c *gin.Context){
	c.JSON(200, gin.H{"message" : "Welcome to Shop"})
    })

	api := r.Group("/api/v1")
	{
		api.GET("/shops", getShops)
		api.GET("/mobiles", getMobiles)
	}

    r.Run(":8080")
}