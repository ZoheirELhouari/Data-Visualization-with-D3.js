# VIS Assginment 3 documentation

## Zoheir El Houari

### Id: a12044027



## Technology used: 
---
- `Node.js(v18.12.1)` 
- `npm(v8.19.3)` 
- `React.js(v^18.2.0)` 
- `D3(v7.6.1)` 
 

## How to run Project:
---
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and `npm` was used for package management.
## Available Scripts

### `npm install`
Installs all the library dependencies needed for the project.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.



## The Design decisoins :
- At First, i load all the datasets using d3 promise and merge both the datasets into one big list containting both information.
- The `YearSlider.js` takes a list of years and return selected year using React.js Hook (useEffect).
- Based on selected year, my merged dataset is filtered and store into `filteredMergedData` so that it is accesible from my child components.
- I define `3x3` color array in both `Scatterplot.js and Choropleth`.
- I added (3x3 color) background to the scatter plot using predefined formula. 
- The brushing is done by updating the entry of my combined dataset with the attribute  `d.selected = true` for every entry 
- The main idea behind adding the color to the scatter plot circles is dependent on the value of `d.selected`. I set different colors
based on that. so when ever the data changes, the context of the children componenets will be updated as well. this is a use case of React.js Hooks
- For setting up the ChoroplethMap colors, i have to computed the indices of each scatter plot circle to know which cirle falls in which colored block in the background. The indices were then used to color the ChoroplethMap regions.
- OnClick event over a state in the ChoroplethMap was done by setting `d.clicked = true`and later using the Hook to update the context and all the rest of components are updated automatically. when `d.clicked` is set to true i change the color of the repective circle in the scatter plot to blue. in order to deactivate this click event, just double click on the scatter plot background area.


## Data formatting:
   the formatting of the data in orginal csv file needed some reformating to ease of work on the data later on.
   my reformatting was done by the help of PowerBI
- i uploaded the orginal csv file to PowerBI
-  used the first row as headers 
- selected all the years columns are pivoted them, which resulted in a unique column which i called "year" 
- exported the new formatted data into a csv file which i used for the assignment. :