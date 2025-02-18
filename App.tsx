import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import your data files
import htmlData from './data/html_qna.json';
import cssData from './data/css_qna.json';
import jsData from './data/javascript_qns.json';
import reactData from './data/react.json';
import performanceData from './data/performence-opt.json';
import securityData from './data/frontend-security.json';
import apiData from './data/apintegratioin.json';
import architectureData from './data/artitecture.json';
import devopsData from './data/frontendDevops.json';
import endToEndData from './data/react_endToEnd.json';
import designData from './data/react_design.json';
import systemDesignData from './data/system-desiign.json';

type QuestionItem = {
  question: string;
  answer: string | string[];
  example?: Record<string, string | Record<string, string>>;
};

type DataStructure = {
  [key: string]: QuestionItem[] | Record<string, QuestionItem[] | Record<string, QuestionItem>>;
};

const normalizeData = (data: any): QuestionItem[] | Record<string, QuestionItem[]> => {
  if (Array.isArray(data)) {
    return data as QuestionItem[];
  }
  if (typeof data === 'object' && data !== null) {
    const normalized: Record<string, QuestionItem[]> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        normalized[key] = value as QuestionItem[];
      } else if (typeof value === 'object' && value !== null) {
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
};

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

const routes = [
  { key: 'HTML', title: 'HTML' },
  { key: 'CSS', title: 'CSS' },
  { key: 'JavaScript', title: 'JS/TS' },
  { key: 'React', title: 'React' },
];

const renderScene = SceneMap({
  HTML: () => <CategoryScreen category="HTML" />,
  CSS: () => <CategoryScreen category="CSS" />,
  JavaScript: () => <CategoryScreen category="JavaScript" />,
  React: () => <CategoryScreen category="React" />,
});

const CategoryScreen = ({ category }: { category: string }) => {
  const [visibleAnswers, setVisibleAnswers] = useState<Record<string, boolean>>({});

  const toggleVisibility = (id: string) => {
    setVisibleAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderQuestions = (
    questions: QuestionItem[] | Record<string, any>,
    parentId = ''
  ) => {
    if (Array.isArray(questions)) {
      return questions.map((item, idx) => (
        <QuestionSection
          key={`${parentId}-${idx}`}
          title={item.question}
          isVisible={!!visibleAnswers[`${parentId}-${idx}`]}
          onToggle={() => toggleVisibility(`${parentId}-${idx}`)}
        >
          {item.answer}
        </QuestionSection>
      ));
    }

    return Object.entries(questions).map(([key, value], idx) => (
      <View key={`${parentId}-${key}-${idx}`}>
        <TouchableOpacity
          style={styles.subCategoryHeader}
          onPress={() => toggleVisibility(`${parentId}-${key}`)}
        >
          <Text style={styles.subCategoryText}>{key}</Text>
          <AnimatedIcon isVisible={!!visibleAnswers[`${parentId}-${key}`]} />
        </TouchableOpacity>
        {visibleAnswers[`${parentId}-${key}`] && (
          <View style={styles.subCategoryContent}>
            {renderQuestions(value, `${parentId}-${key}`)}
          </View>
        )}
      </View>
    ));
  };

  return (
    <ScrollView
      contentContainerStyle={styles.categoryContainer}
      showsVerticalScrollIndicator={false}
    >
      {renderQuestions(allData[category], category)}
    </ScrollView>
  );
};

const AnimatedIcon = ({ isVisible }: { isVisible: boolean }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      // easing: Easing.easeOut,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Icon name="keyboard-arrow-down" size={24} color="#6C24AA" />
    </Animated.View>
  );
};

const QuestionSection = ({
  title,
  children,
  isVisible,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  isVisible: boolean;
  onToggle: () => void;
}) => {
  const heightAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      // easing: Easing.easeOut,
      useNativeDriver: false,
    }).start();
  }, [isVisible]);

  const height = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1000], // Adjust based on maximum expected content height
  });

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity
        onPress={onToggle}
        style={styles.questionHeader}
        activeOpacity={0.8}
      >
        <Text style={styles.questionText}>{title}</Text>
        <AnimatedIcon isVisible={isVisible} />
      </TouchableOpacity>

      <Animated.View style={{ maxHeight: height, overflow: 'hidden' }}>
        <View style={styles.answerContainer}>
          {Array.isArray(children) ? (
            children.map((text, index) => (
              <Text key={index} style={styles.answerText}>
                {text}
              </Text>
            ))
          ) : (
            <Text style={styles.answerText}>{children}</Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const App = () => {
  const [index, setIndex] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#6C24AA', '#4B088A']}
        style={styles.header}
      >
        <Image
          source={require('./assets/trangla-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Interview Preparation</Text>
      </LinearGradient>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={styles.tabIndicator}
            style={styles.tabBar}
            // labelStyle={styles.tabLabel}
            activeColor="#FFD700"
            inactiveColor="#FFFFFF"
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingVertical: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 200,
    height: 60,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tabBar: {
    backgroundColor: '#6C24AA',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabIndicator: {
    backgroundColor: '#FFD700',
    height: 3,
  },
  tabLabel: {
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'capitalize',
    color: '#FFFFFF',
  },
  categoryContainer: {
    padding: 16,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
    fontWeight: '600',
    marginRight: 12,
  },
  answerContainer: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  answerText: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 22,
    marginBottom: 8,
  },
  subCategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    marginVertical: 8,
  },
  subCategoryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B088A',
  },
  subCategoryContent: {
    marginLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#E2E8F0',
  },
});

export default App;