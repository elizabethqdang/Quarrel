Quora
-----
Questions
Answers/comments on answers
Search Questions
Topics/Tags

**Bonus** 
Upvotes, order questions by popularity
Replies to comments

1) Basic User Auth Skeleton
2) Create Questions and Answers
3) Topics/Tags
4) Search Engines

graphql - good since we would need to display all data on single page
CSS - Not fancy looking would need to improvise and make look professional


Features
----------
*Splash Page*
Background Image       
                      Header Logo Img
                    <H2> Mission statement
        *google api*                      *login component* (always displays)
                                            <h2> Login
    Google sign in API?             |       Email input                                      
    "sign up with email" links to   |       Password input
                renders signup form |     forgot password?   Login submit button                  
        *Signup Form*
     <h2> Sign up
     First Name, Last Name
     Email
     Password
     reCaptchav3 api?
     cancel button (takes you back to login) and sign up submit button
        ___
      *Footer Links*
      About About Developer pages? LinkedIn pages?



*Header Bar*
-----------
websockets
Logo
  - links to homepage
Home icon
  - links to homepage
Answer icon
  - links to questions for you ("/answer")
Spaces icon (optional)
  - opens dropdown of followed spaces as well
  - also contains a link to see all spaces ("/spaces)
Notification
  -links to notification page "/notification"
  -shows posts from spaces
  **i'm assuming also shows info about asked questions and upvotes
Searchbar Component
  -selecting opens modal
  -typing autofills/suggest topics/spaces
  -link to "add a new question" modal
Profile Picture
  -opens dropdown
      -messages
      -stats
      -your content
        -links to "/content" page of questions asked, answers
Add a question button
  -opens up modal

*topics-sidebar*
---------------
Feed Button
  -links to homepage
  -List of Followed Topics
    - Each Item is a link to topic page "/q/topic-name"
*footer-links*




User Auth
----------
* Register
  - First Name
  - Last Name
  - Email
  - Password
* Login
  - Email
  - Password
  
  topics and spaces are visable to all (with url link)
  posting requires authentication
Questions
---------
* Modal
* Header
  - Tab 1: Add question
  - Tab 2: Share link
  - Ul: Advice to get better answers
* Ask form
  - Ask header
    - Current user profile picture
    - Current User Name
    - Privacy options
  - Ask Form
    - Text area
    * Related questions
    - Optional Link
  - Footer
    - Cancel button
    - Add question button
* Share link form
  - Current User profile pic
  - Current User name
  - Text area
  - Input for link
    

Answers (directly from a question page)
--------- 
Answer button
	- modal form pops up
	- answer form
		- styling button features
		- attach picture option
		- text box
Follow button
	- just a button
Request button

Answers (from nav bar) links to /answers
_________
	- question
	- topic
	- Answer button (opens answer box)
	- Pass button (hides question)
	- Follow button
	- X close button (hides question)


Topics
---------
* Name of topic
* Description
* Other
  - follow
  - contains posts and questions

Search Bar
---------
- Modal
- Autofill
- Link to add new question

# Components 

Questions for You
---------------
* Maps questions on topics you have followed
* Clicking answer displays form/textarea to answer



# Routes

* "/": Splash Page (logged out)/Feed (logged in)
* "/answer": Answer questions
* "/topic/:name": Topic Index
* "/:(question with whitespace parsed as '-' and special characters removed): Question Show
* 


# CSS Layout

* NavBar
  - Width is 100%
  - Inner content is fixed at 1005px and centered
  - Height is fixed 50px

* Main Content
  - Everything is centered and contained in a div with width 1050px
  - Background color outside of content is #F1F2F2
  
* Feed 
  - Width of each container is 600px
  - 16x 16x 4px padding
  - Divs should have id of the question id to expand/collapse comments form