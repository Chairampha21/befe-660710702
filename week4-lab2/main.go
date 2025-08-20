package main

import(
	"fmt"
)
// var email String = "Khrueapan_c@su.ac.th"

func main(){
	// var name String = "chairampha"
	var age int = 21

	email := "Khrueapan_c@su.ac.th"
	gpa := 3.18

	firstname,lastname := "chairampha","khrueapan"

	fmt.Printf("Name %s %s,age %d, email %s, gpa %.2f\n",firstname,lastname,age,email,gpa)
}