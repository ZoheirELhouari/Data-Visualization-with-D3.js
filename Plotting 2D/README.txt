The goal of the assignment is to plot two dimensional data on a line chart using d3 package and adding basic brushing interaction. my solution was done following these steps: 



 1- Defining global variables that contains the svg element dimensions (svg_width, svg_heigh respectivly)
 2- Formating the data by conveting it from a string to a number
 3- Groupping the data by country name 
 4- Creating the SVG element that would serve as out main line chart  and adding the respective styling
 5- Adding the x and y axis labels with the respective (x,y) coordinates as children element of the SVG ( class = container)
 6- Creating both the scales and axis for x and y respectively 
 7- Adding a group element (classed as containerchart) that serves as a container for the all the paths
 8- Creating the lines inside the group element by biding it with with respective groupped data (using  .data() and .join() ) so that we have the same number 
        of lines as countries in the dataset
 9- Adding the mouseover and mouseout interactions where on mouseover a line, it changes color and width and a hidden div containing the specific point information gets shown, while the mouseout event just
      just hides the new displayed div and returnes the line to the default color and width 
 10- Adding the mouse click event that makes a color gets highlighted perminatly (see challenges bellow)
 11- Repeated the same steps (from 1-10) for the second SVG that would be used as a brushing aread with the except of displaying the y-axis, and a smaller svg_hight than our main SVG
 12- Addeding the brushing effect with the help of  d3.brushX()  that uses the brushed function that maps the brushed area to the xScale, and the updateGraph function that updates our main line chart 


Data formatting:
   the formatting of the data in orginal csv file needed some reformating to allow grouping which would be done by d3 later. 
   my reformatting was done by the help of PowerBI
	- i uploaded the orginal csv file to PowerBI
	-  used the first row as headers 
	- selected all the years columns are pivoted them, which resulted in a unique column which i called "year" 
	- exported the new formatted data into a csv file which i used for the assignment.



Challanges: 
  - for the click event, i had to do some string manupilation in order to get an id that doen't voilate the query selector syntax (such as containing a dot or white spaces)  in the id string which would be
   used to keep the line highlighted 
  - after completing the brushing effect i had an issue of having the lines go outside my original drawing area, which i solved by used the clipPath that serves as a restriction to which paint can be applied 
    meaning the parts that lies outside my original drawing area would not be shown after the brushing.	
