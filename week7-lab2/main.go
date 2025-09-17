package main

import (
	"fmt"
	"os"
)

func getEnv(key, defaultValue string) string{
	if value := os.Getenv(key); value != ""{
		return value
	}
	return defaultValue
}

func main(){
	host := getEnv("DB_HOST", "")
	name := getEnv("DB_NAME", "")
	user := getEnv("DB_USER", "")
	pasword := getEnv("DB_PASSWORD", "")
	port := getEnv("DB_POT", "")

	conSt := fmt.Sprintf("host=%s port=%s user=%s pasword=%s dbname=%s", host, port, user, pasword, name)
	fmt.Println(conSt)
}