# View Controller

This is a bit of lightweight javascript framework to provide easy access to a traditional style class / inheritance structure combined with a global view controller which acts to automate instancing of scripts to dom and to provide some sugary helpers to make the writing of dom centric javascript a bit more elegant.

## Setup

For the purposes of getting this working. From terminal run:

	sudo npm install

Followed by 

	gulp

to run the watch script.

## Browserify

The system will work with anything if pulled in but is currently constructed with browserify in mind. 

## The Module

The module is a very simple class-style object wrapper. It's designed to make inheritance very accessible as well as obfuscating some of the uglier parts of instantiation and object cloning. 