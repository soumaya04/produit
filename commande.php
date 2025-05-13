<?php
// Lire les données envoyées par AJAX
$data = json_decode(file_get_contents("php://input"), true);

// Vérifie si le panier est présent
if (isset($data['email'], $data['adresse'], $data['panier'])) {
  // Enregistrer la commande dans un fichier 
  file_put_contents('commandes.txt', print_r($data, true), FILE_APPEND);


  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error", "message" => "Données invalides"]);
}
?>
