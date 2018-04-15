/*global exports, console, require*/
import createIndex from './createIndex';

export const handler = function (event, context) {
	'use strict';
	console.log('creating index for', JSON.stringify(event));
	var eventRecord = event.Records && event.Records[0];
	if (eventRecord) {
		if (eventRecord.eventSource === 'aws:s3' && eventRecord.s3) {
			generateListing(event, context.done);
		} else {
			context.fail('unsupported event source');
		}
	} else {
		context.fail('no records in the event');
	}
};
