import React, { useState } from "react";
import { Box, Button, Container, Heading, Input, InputGroup, InputLeftElement, List, ListItem, Stack, Text, VStack, HStack, Divider, OrderedList, ListItemProps } from "@chakra-ui/react";
import { FaSearch, FaArrowRight, FaCheck } from "react-icons/fa";

const initialValues = [
  "Honesty",
  "Integrity",
  "Courage",
  "Respect",
  "Responsibility",
  "Humility",
  "Compassion",
  "Fairness",
  "Perseverance",
  "Self-discipline",
  // Add more values here as needed
];

const Index = () => {
  const [page, setPage] = useState(0);
  const [values, setValues] = useState(initialValues);
  const [search, setSearch] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [matchups, setMatchups] = useState([]);
  const [currentMatchup, setCurrentMatchup] = useState(0);
  const [results, setResults] = useState({});

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    const filteredValues = initialValues.filter((value) => value.toLowerCase().includes(e.target.value.toLowerCase()));
    setValues(filteredValues);
  };

  const handleValueSelect = (value) => {
    if (selectedValues.includes(value) || selectedValues.length >= 10) return;
    setSelectedValues([...selectedValues, value]);
  };

  const startComparisons = () => {
    setPage(2);

    let matchups = [];
    for (let i = 0; i < selectedValues.length; i++) {
      for (let j = i + 1; j < selectedValues.length; j++) {
        matchups.push([selectedValues[i], selectedValues[j]]);
      }
    }

    setMatchups(matchups);
    setResults(selectedValues.reduce((acc, value) => ({ ...acc, [value]: 0 }), {}));
  };

  const handleComparisonSelect = (winner, loser) => {
    setResults({ ...results, [winner]: results[winner] + 1 });
    if (currentMatchup + 1 < matchups.length) {
      setCurrentMatchup(currentMatchup + 1);
    } else {
      setPage(3);
    }
  };

  const sortedResults = () => {
    return Object.entries(results).sort((a, b) => b[1] - a[1]);
  };

  return (
    <Container maxW="container.md" py={10}>
      {page === 0 && (
        <VStack spacing={6} align="stretch">
          <Heading>Welcome to the Value Rating App</Heading>
          <Text>This app helps you to prioritize your values by making comparisons. Click 'Start Rating' to begin the process.</Text>
          <Button rightIcon={<FaArrowRight />} onClick={() => setPage(1)}>
            Start Rating
          </Button>
        </VStack>
      )}

      {page === 1 && (
        <VStack spacing={6} align="stretch">
          <Heading>Select Your Top 10 Values</Heading>
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<FaSearch />} />
            <Input placeholder="Search values" onChange={handleSearchChange} />
          </InputGroup>
          <List spacing={3}>
            {values.map((value) => (
              <ListItem key={value} p={2} bg={selectedValues.includes(value) ? "green.100" : "gray.100"} cursor="pointer" onClick={() => handleValueSelect(value)}>
                {value}
                {selectedValues.includes(value) && <FaCheck ml={2} />}
              </ListItem>
            ))}
          </List>
          {selectedValues.length === 10 && (
            <Button rightIcon={<FaArrowRight />} onClick={startComparisons}>
              Start Comparisons
            </Button>
          )}
        </VStack>
      )}

      {page === 2 && (
        <VStack spacing={6} align="stretch">
          <Heading>Compare Values</Heading>
          <Text>Choose which value is more important to you in each matchup.</Text>
          <Box p={4} bg="gray.100">
            <HStack justify="space-between">
              <Button colorScheme="blue" onClick={() => handleComparisonSelect(matchups[currentMatchup][0], matchups[currentMatchup][1])}>
                {matchups[currentMatchup][0]}
              </Button>
              <Text>vs</Text>
              <Button colorScheme="blue" onClick={() => handleComparisonSelect(matchups[currentMatchup][1], matchups[currentMatchup][0])}>
                {matchups[currentMatchup][1]}
              </Button>
            </HStack>
          </Box>
        </VStack>
      )}

      {page === 3 && (
        <VStack spacing={6} align="stretch">
          <Heading>Your Values Ranked</Heading>
          <OrderedList spacing={3}>
            {sortedResults().map(([value, wins]) => (
              <ListItem key={value}>
                <HStack justify="space-between">
                  <Text>{value}</Text>
                  <Text>{wins} wins</Text>
                </HStack>
              </ListItem>
            ))}
          </OrderedList>
        </VStack>
      )}
    </Container>
  );
};

export default Index;
