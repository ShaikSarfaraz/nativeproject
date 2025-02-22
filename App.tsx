import type React from "react"
import { useState } from "react"
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Image
} from "react-native"

import htmlData from "./data/html_qna.json"
import cssData from "./data/css_qna.json"
import jsData from "./data/javascript_qns.json"
import reactData from  "./data/react.json"
import performanceData from "./data/performence-opt.json"
import securityData from "./data/frontend-security.json"
import apiData from "./data/apintegratioin.json"
import architectureData from "./data/artitecture.json"
import devopsData from "./data/frontendDevops.json"
import endToEndData from "./data/react_endToEnd.json"
import designData from "./data/react_design.json"
import systemDesignData from "./data/system-desiign.json"
// import testingData from "./data/react_testing.json"
// import advancedData from "./data/react_advance.json"

type QuestionItem = {
  question: string;
  answer: string | string[];
  example?: Record<string, string | Record<string, string>>;
}

type DataStructure = {
  [key: string]: 
    | QuestionItem[] 
    | Record<string, QuestionItem[] | Record<string, QuestionItem>>;
};


function normalizeData(data: any): QuestionItem[] | Record<string, QuestionItem[]> {
  if (Array.isArray(data)) {
    return data as QuestionItem[];
  } else if (typeof data === "object" && data !== null) {
    const normalized: Record<string, QuestionItem[]> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        normalized[key] = value as QuestionItem[];
      } else if (typeof value === "object" && value !== null) {
        const nestedNormalized = normalizeData(value);
        if (Array.isArray(nestedNormalized)) {
          normalized[key] = nestedNormalized;
        } else {
          Object.assign(normalized, nestedNormalized);
        }
      }
    });
    return normalized;
  }
  return [];
}

const allData: DataStructure = {
  HTML: normalizeData(htmlData),
  CSS: normalizeData(cssData),
  JavaScript: normalizeData(jsData),
  React: normalizeData(reactData),
  endToEnd: normalizeData(endToEndData),
  Design: normalizeData(designData),
  Performance: normalizeData(performanceData),
  Security: normalizeData(securityData),
  API: normalizeData(apiData),
  Architecture: normalizeData(architectureData),
  Devops: normalizeData(devopsData),
  SystemDesign: normalizeData(systemDesignData),
};


type SectionProps = {
  title: string
  children: React.ReactNode
  onToggleVisibility: () => void
  isVisible: boolean
}

function Section({ title, children, onToggleVisibility, isVisible }: SectionProps) {
  const isDarkMode = useColorScheme() === "dark"
  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={onToggleVisibility} style={styles.questionContainer}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? "#fff" : "#000" }]}>{title}</Text>
        <Text style={styles.arrow}>{isVisible ? "↑" : "↓"}</Text>
      </TouchableOpacity>
      {isVisible && (
        <Text style={[styles.sectionDescription, { color: isDarkMode ? "#ccc" : "#333" }]}>
          {Array.isArray(children) ? children.join("\n\n") : children}
        </Text>
      )}
    </View>
  )
}

function App() {
  const isDarkMode = useColorScheme() === "dark"
  const backgroundStyle = {
    backgroundColor: isDarkMode ? "#222" : "#f8f9fa",
  }

  const [visibleAnswers, setVisibleAnswers] = useState<Record<string, boolean>>({})

  const toggleVisibility = (index: string) => {
    setVisibleAnswers((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }))
  }

  const renderQuestions = (
    questions: QuestionItem[] | Record<string, QuestionItem[] | Record<string, QuestionItem>>,
    category: string,
  ) => {
    if (Array.isArray(questions)) {
      return questions.map((item, idx) => (
        <Section
          key={`${category}-${idx}`}
          title={item.question}
          onToggleVisibility={() => toggleVisibility(`${category}-${idx}`)}
          isVisible={visibleAnswers[`${category}-${idx}`] || false}
        >
          {item.answer}
        </Section>
      ))
    } else {
      return Object.entries(questions).map(([subCategory, subQuestions], subIdx) => (
        <View key={`${category}-${subCategory}`}>
          <TouchableOpacity
            style={styles.subTitleContainer}
            onPress={() => toggleVisibility(`${category}-${subCategory}`)}
          >
            <Text style={styles.subCategoryTitle}>
              {subCategory} <Text style={styles.arrow}>{visibleAnswers[`${category}-${subCategory}`] ? "↑" : "↓"}</Text>
            </Text>
          </TouchableOpacity>

          {visibleAnswers[`${category}-${subCategory}`] &&
            (Array.isArray(subQuestions)
              ? subQuestions.map((item, idx) => (
                <Section
                  key={`${category}-${subCategory}-${idx}`}
                  title={item.question}
                  onToggleVisibility={() => toggleVisibility(`${category}-${subCategory}-${idx}`)}
                  isVisible={visibleAnswers[`${category}-${subCategory}-${idx}`] || false}
                >
                  {item.answer}
                </Section>
              ))
              : Object.entries(subQuestions).map(([subSubCategory, item], idx) => (
                <Section
                  key={`${category}-${subCategory}-${subSubCategory}`}
                  title={(item as QuestionItem).question}
                  onToggleVisibility={() => toggleVisibility(`${category}-${subCategory}-${subSubCategory}`)}
                  isVisible={visibleAnswers[`${category}-${subCategory}-${subSubCategory}`] || false}
                >
                  {(item as QuestionItem).answer}
                </Section>
              )))}
        </View>
      ))
    }
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <View style={styles.container}>
          <Image
            source={require('./assets/trangla-logo.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.container2}>
          <Text style={styles.title}>Interview Preparation</Text>
        </View>
        <View style={styles.container3}>
          <Image source={require('./assets/html.webp')} style={styles.logos} />
          <Image source={require('./assets/css.webp')} style={styles.logos} />
          <Image source={require('./assets/js.png')} style={styles.logos1} />
          <Image source={require('./assets/react.png')} style={styles.logos} />
        </View>

        <View style={styles.container4}>
            {Object.entries(allData).map(([category, questions], index) => (
              <View key={category}>
                <TouchableOpacity style={styles.titleContainer} onPress={() => toggleVisibility(category)}>
                  <Text style={styles.categoryTitle}>
                    {category} <Text style={styles.arrow}>{visibleAnswers[category] ? "" : ""}</Text>
                  </Text>
                </TouchableOpacity>

                {visibleAnswers[category] && renderQuestions(questions, category)}
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 42,
  },
  container3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    margin: 10,
  },
  container4: {
    padding: 10,
    marginLeft: 20,
    marginRight: 20
  },
  logos: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  logos1: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    borderRadius: 35,
  },
  image: {
    width: 250,
    height: 80,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "monospace",
    // color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  titleContainer: {
    marginTop: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4f0b6a",
  },
  sectionContainer: {
    marginTop: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 16,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionDescription: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 20,
  },
  subTitleContainer: {
    marginTop: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  subCategoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0056b3",
  },
})

export default App

