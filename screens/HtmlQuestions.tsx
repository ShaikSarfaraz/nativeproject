import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  "Home": undefined;
  "HTML Questions": undefined;
};

type HtmlQuestionsNavigationProp = StackNavigationProp<RootStackParamList, "HTML Questions">;

type Props = {
  navigation: HtmlQuestionsNavigationProp;
};

// ✅ Define a type for questions
type QuestionType = {
  question: string;
  answer: string;
};

const HtmlQuestions: React.FC<Props> = ({ navigation }) => {
  const [questions, setQuestions] = useState<QuestionType[]>([]); // 👈 Explicitly define the state type

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const jsonData = require('./html_qna.json'); // Load JSON data
      setQuestions(jsonData["HTML Questions"] || []); // Ensure data is assigned properly
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>HTML Questions</Text>
      <FlatList
        data={questions}
        keyExtractor={(_, index) => index.toString()} // Use index as key
        renderItem={({ item }) => (
          <View style={styles.questionContainer}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  answer: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default HtmlQuestions;
