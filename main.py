import webapp2
import os
import urllib2
import jinja2
import json
import datetime
import hashlib
from google.appengine.ext import ndb
from google.appengine.api import mail

jinja_environment =  jinja2.Environment(autoescape=True,
    loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))


class MainHandler(webapp2.RequestHandler):
    def get(self):
        template = jinja_environment.get_template("index.html")
        self.response.out.write(template.render())
        
class AIAgent(webapp2.RequestHandler):
    def get(self):
        self.response.status_int(200)
        self.response.body("40")

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/autoplay',AIAgent),
], debug=True)
