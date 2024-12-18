// screens/Home.js
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import Card from "../components/Card";
import { logoutUser } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";

const Home = ({ navigation }) => {
  const [documents, setDocuments] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchDocuments = async () => {
        const documents = await AsyncStorage.getItem("documents");
        if (documents) {
          setDocuments(JSON.parse(documents));
        }
      };

      fetchDocuments();

      return () => {};
    }, [])
  );

  const handleLogout = async () => {
    await logoutUser();
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seus Documentos</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <FontAwesome name="sign-out" size={24} color="black" />
      </TouchableOpacity>
      {documents.length === 0 ? (
        <View style={styles.placeholder}>
          {/* Placeholder Image */}
          <Text>Você ainda não adicionou nenhum documento.</Text>
        </View>
      ) : (
        <FlatList
          data={documents}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("DocumentDetails", { item })}
            >
              <Card {...item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("Scan")}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// Add styles here
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007BFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 30,
    lineHeight: 30,
  },
  logoutButton: {
    position: "absolute",
    top: 55,
    right: 20,
    padding: 10,
    backgroundColor: "transparent",
    borderRadius: 5,
  },
});
export default Home;
