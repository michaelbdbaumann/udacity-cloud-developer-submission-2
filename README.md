# Image processing microservice using Elastic Beanstalk
## Development Server

[x] Starting the server with npm run dev runs a local instance of the server with no errors

[x] The stubbed @TODO1 endpoint in src/server.js is completed and accepts valid requests including: http://localhost:{{PORT}}/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg

[x] Successful responses have a 200 code, at least one error code for caught errors (i.e. 422)

### Implementation Details
- The provided implementaion for `filterImageFromURL` was not working - based on a support entry (cf. https://knowledge.udacity.com/questions/994301) I introduced axios for fetching the image and passing the response to JIMP
- I found multiple levels of catch quite confusing and refactored it to just use await where possible and return errors transparently via status code and description
- After startup some health checks for typical usecases are run
- The root URL returns an OpenAPI spec for documenting the endpoint

# Elastic Beanstalk Deployment

[x] The project was deployed using the AWS Elastic Beanstalk CLI eb init, eb create, and eb deploy commands, accepting defaults where sensible

[x] A screenshot of the elastic beanstalk application dashboard is included in a deployment_screenshot directory.

[x] An [endpoint URL](http://image-processing-microservice-dev.us-east-1.elasticbeanstalk.com) for a running elastic beanstalk deployment (EB_URL) has been submitted along with the project submission. This endpoint responds to valid GET requests including: [Example from Wikipedia](http://image-processing-microservice-dev.us-east-1.elasticbeanstalk.com/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg)


