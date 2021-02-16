package main

import (
	"log"
	"net/http"
	"text/template"
)

func main() {
	var err error
	var tmplLogin *template.Template
	var tmplCheckin *template.Template
	tmplLogin, err = template.ParseFiles("./src/login.html")
	if err != nil {
		log.Fatal("Unable to open html: ", err)
	}
	tmplCheckin, err = template.ParseFiles("./src/checkin.html")
	if err != nil {
		log.Fatal("Unable to open html: ", err)
	}

	http.Handle("/src/", http.StripPrefix("/src/", http.FileServer(http.Dir("./src"))))
	http.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
		if err = tmplLogin.Execute(rw, map[string]interface{}{}); err != nil {
			log.Fatal("Unable to execute: ", err)
		}
	})
	http.HandleFunc("/checkin", func(rw http.ResponseWriter, r *http.Request) {
		if err = tmplCheckin.Execute(rw, map[string]interface{}{}); err != nil {
			log.Fatal("Unable to execute: ", err)
		}
	})

	if err = http.ListenAndServe(":3000", nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
