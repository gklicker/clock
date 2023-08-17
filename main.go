package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Разрешаем все источники для WebSocket-подключения (не рекомендуется в боевом окружении)
	},
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	for {
		currentTime := time.Now().UTC().Format("2006-01-02 15:04:05")
		err := conn.WriteMessage(websocket.TextMessage, []byte(currentTime))
		if err != nil {
			break
		}
		time.Sleep(time.Second) // Обновление времени каждую секунду
	}
}

func serveIndexPage(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "index.html")
}

func main() {
	http.HandleFunc("/ws", handleWebSocket)
	http.HandleFunc("/", serveIndexPage)

	serverAddr := "127.0.0.1:8080"
	fmt.Printf("Server is running at http://%s\n", serverAddr)
	err := http.ListenAndServe(serverAddr, nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}
