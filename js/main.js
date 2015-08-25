'use strict';

require.config({
	baseUrl: 'js',
	paths: {
		jquery: 'lib/jquery-2.1.4'
	},
	deps: []
});

require(['app']);
