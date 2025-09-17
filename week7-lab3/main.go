package main

import (
	"fmt"
	"os"
	"database/sql"
	_ "github.com/lib/pq"
	"log"
)

func getEnv(key, defaultValue string) string{
	if value := os.Getenv(key); value != ""{
		return value
	}
	return defaultValue
}

var db *sql.DB

func initDB(){
	var err error
	host := getEnv("DB_HOST", "")
	name := getEnv("DB_NAME", "")
	user := getEnv("DB_USER", "")
	pasword := getEnv("DB_PASSWORD", "")
	port := getEnv("DB_POT", "")

	conSt := fmt.Sprintf("host=%s port=%s user=%s pasword=%s dbname=%s sslmod=disable", host, port, user, pasword, name)
	// fmt.Println(conSt)
	db, err = sql.Open("postgres", conSt)
	if err != nil{
		log.Fatal("failed to open database")
	}

	err = db.Ping()
	if err != nil{
		log.Fatal("failed to connect database")
	}
	log.Println("successfully connected tov database")

}

func main(){
	 initDB()
}