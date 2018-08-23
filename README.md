# Welcome to Differentiate Objects!

Have you ever needed to compare two JSON objects and make a determination on what is changed deep in the object hierarchy and be able to clearly see what is changed on either objects on the fly while they change?
Have you ever wished for ability to merge the two JSON objects as well? Have you looked for something that is visually appealing as well?
Would you like to know how it can be done? Would you like to have it done without writing code for it? Take a look at the demo and enjoy the ride.

Differentiate is an Angular based code and will interpret changes deep in JSON hierarchy by displaying visual representation of changes on both sides. Add/Remove representation are done through "+" / "-" characters as well as line curves which are displayed differently based on the an attribute depth. Change of value between two name/value pairs are displayed by "~" characters.

**NOTE:** Version 1.5.0 is the latest version compatible with Angular 2+, 4+, or 5+.

**NOTE:** Version 2.0.0 is the first version compatible with Angular 6+. I tried my demo project with 6+ version of this library while project is still Angular 5 based without facing any issues.

**I appreciate comments and requests.** please go to provided link and make your comments.

[Live Demo](https://diffrenciate.stackblitz.io) | [Source code](https://github.com/msalehisedeh/differentiate/tree/master/src/app) | [Comments/Requests](https://github.com/msalehisedeh/differentiate/issues)


## Attributes
| Attribute                |Description                                                                                                                |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------|
|allowRevert               |Will allow user to revert any one of the changed attributes/values found on right hand-side to be same as left hand-side.  |
|allowAdvance              |Will allow user to revert any one of the changed attributes/values found on left hand-side to be same as right hand-side.  |
|leftSideObject            |JSON Object on left-hand side to be differentiated.                                                                        |
|rightSideObject           |JSON Object on right-hand side to be differentiated.                                                                       |
|onlyShowDifferences       |If set, will ignore all attributes in JSON hierarchy which are not changed.                                                |
|attributeOrderIsImportant |If set, will consider change of order as a difference. If not set, will sort all JSON attributes in its object hierarchy.  |

## Events
| Event                    |Description                                                                                                                |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------|
|onrevert                  |Will be fired when any one of changed items on left hand-side should replace or push to the right hand-side item. The event is copy of JSON object after being modified to accommodate the request.  |
|onadvance                 |Will be fired when any one of changed items on right hand-side should replace or push to the left hand-side item. The event is copy of JSON object after being modified to accommodate the request.  |
|ondifference              |Will fire the total difference count after sides are compared. If there is no difference, count will be zero.              |


# Version 2.1.3
Added **ondifference** event. I realized there is a need to display messages or hide action buttons if there are differences between two JSON objects. As a result, immediately after a comparission performed, this event is fired.

# Version 2.1.1
Fixed minor issues. You definitely need to upgrade to this version. Also, I found something that I want to report.  I was under impression that Angular 6 is not compatible with 2,4,5. However, for the demo, I upgraded the differentiate demo on stackblitz.io and kept angular 5 library. 
It is still working fine. so, just in case, if you decide to use the latest version of this library with your Angular 5 project, try it out. and see if it works wor you.

# Version 2.1.0
Made the spinner delay a bit more extended to create a feeling that something is being done and I think it makes it look performing. 
Also added ability to fully merge left and right sides interchangeably by adding a **onadvance** event.  I wanted to change the onrevert action to something more appropriate but I decided to keep it just in case someone is already using the action already.
I suggest you update your references when the events are fired and then provide a submit button to save the JSON objects in one shot when user is ready. 

Keep in mind, if you set the flag to only see the differences, the json sent to you in onadvance or onrevert is the subset items. As a result you would need to infuse the items sent to you in your local copy.

# Version 2.0.1
To create impression of performance when comparing large size JSON objects, made the process non-blocking and added a wait spinner.

# Version 2.0.0
updated dependencies (no code change) to work with Angular 6 which will not fit within Angular 5, 4, or 2 because of a change made by angular folks.
If your project is not an Angular 6+ project, please update your package.json file and remove "^" to make sure you are not accidentally upgrading to 2.0.0 and above versions of differentiate.

# Version 1.5.0
Added ability to revert any changed attribute/value of JSON on right hand-side to become same as attribute/value on left hand-side. 
In addition this version will be the last version workable in Angular 2, 4, or 5. In next release, I will update dependencies to work with Angular 6 which will not fit within Angular 5, 4, or 2 because of a change made by angular folks which will cause issues between Angular 5 and 6.

# Version 1.1.0
Fixed internal logic issue to handle complicated data structures. Added attributes to have a better control over the resulting display. 

# Version 1.0.0
Compiled with AOT option and resolved issues. 


# Version 0.0.6
```
MODULE:
  DifferentiateModule

EXPORTS:
  DifferentiateComponent
  DifferentiateTree
```

## So... How it can be done?

Run `npm install differentiate` in your application. and do the following:

in your html:
```javascript
	<differentiate 
		onlyShowDifferences="true"
		attributeOrderIsImportant="true"
		allowRevert="true"
		allowAdvance="true"
		(onrevert)="revert($event)"
		(onadvance)="advance($event)"
		[leftSideObject]="leftJSONtree" 
		[rightSideObject]="rightJSONtree"></differentiate>
```

Initiate / create both **leftJSONtree** and **rightJSONtree** in your component. 
If at any time one of the objects updated, Differentiate  re-evaluate and displayed the difference immediately.

To handle onrevert or onadvance events, you need to do something like this
```javascript
	revert(event) {
		Object.keys(event).map( (key) => {
			this.myLocalCopyOfJsonOnRightside[key] = event[key];
		});
	}
```


Include the **DifferentiateModule** module in your App module.
```javascript
	import { BrowserModule } from '@angular/platform-browser';
	import { NgModule } from '@angular/core';
	import { DifferentiateModule } from 'differentiate';

	import { AppComponent } from './app.component';

	@NgModule({
	  declarations: [
		AppComponent
	  ],
	  imports: [
		BrowserModule,
		DifferentiateModule
	  ],
	  providers: [
	  ],
	  bootstrap: [AppComponent]
	})
	export class AppModule { }
```

It is that simple..!!

Sample view of the component at work! (You can create drop-downs and JSON log views to manipulate the **differentiate** component...)
![alt text](https://raw.githubusercontent.com/msalehisedeh/differentiate/master/sample.png "What you would see when a comparison is performed")

