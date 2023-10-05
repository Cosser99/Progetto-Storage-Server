# Progetto-Storage-Server
Progetto Storage server di Sergi Cosimo
# Requisiti:
L'obiettivo dell'esercizio è creare un server di storage con API CRUD e un sistema di login utilizzando Node.js e il framework Fastify.
Il server deve essere in grado di salvare i dati in un file JSON sul file system e autenticare gli utenti attraverso un token JWT. 
In particolare, i passi sono :
- Creare un progetto Node.js
- Installare Fastify e jsonwebtoken con "npm install fastify jsonwebtoken"
- Definire gli endpoint API utilizzando i metodi appropriati di Fastify
- Utilizzare il modulo "fs" di Node.js per scrivere e leggere dati dal file JSON
- Implementare la logica di autenticazione e generazione del token JWT nel endpoint di login
- Implementare la logica di validazione del token JWT nei endpoint di CRUD
- Implementare la logica di validazione per i dati
- Testare il server con un client HTTP come Postman o curl.
  
Il server deve avere i seguenti endpoint principali:<br>
 POST /login - autentica l'utente e restituisce un token JWT<br>
 POST /data - crea un nuovo dato (richiede il token JWT)<br>
 GET /data/:id - recupera un dato specifico dato il suo ID (richiede il token JWT)<br>
 PUT /data/:id - aggiorna un dato esistente dato il suo ID (richiede il token JWT)<br>
 DELETE /data/:id - elimina un dato esistente dato il suo ID (richiede il token JWT)<br>
 Il formato dei dati è un oggetto JSON con "id" (un identificatore univoco) e "data" (i dati da salvare).<br>

# UTILIZZO
Per interfacciarsi al server consiglierei di utilizzare POSTMAN ma eventualmente si può utilizzare il comando curl
#### CURL WINDOWS:
curl -i -X POST -d "{\"username\": \"admin\", \"password\": \"admin\"}" http://localhost:3000/login -H "Content-Type: application/json"
## POSTMAN:
Per il login: <br>
Creare una finestra di POST con l'indirizzo <indirizzo>/login <br>
BODY => RAW => JSON <br>
```
{"username"="<user>","password"="<password>"}
//Username e password principali : admin , admin (vedi file users.txt)
```
Copiare e incollare la risposta (JWT Token) nel Bearer Token delle altre finestre <br>
Per inserire un dato dal file data.txt <br>
Creare una finestra POST <indirizzo>/data <br>
BODY => RAW => JSON <br>
```
{"id"=<id>,"data"="<data>"}
//attento ad <id> è formato numerico quindi senza gli apici " " (Dovrebbe funzionare anche senza)
```
Per richiedere un dato dal file , finestra GET <indirizzo>/data/:id <br>
Per modificare un dato dal file , finestra PUT <indirizzo>/data/:id <br>
BODY => RAW => JSON <br>
```
{"id"=<id>,"data"="<nuovo_dato>"}
//L'id deve combaciare con <indirizzo>/data/:id vedrò di migliorare la cosa
```
Per eliminare un dato dal file, finestra DELETE <indirizzo>/data/:id <br>

## AGGIORNAMENTI 23/09/2023:
-Diviso il codice in moduli<br>
-Corretto alcuni errori sulla GET e POST<br>
-Cambiato il formato del file e la sua gestione<br>
-Schema unico per ogni handler <br>
-Risposte con status code <br>
