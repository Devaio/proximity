'use strict'; require('colors');
/*///////////////////////////////////////////////////////////////////////////////////////////////////
ppppp   ppppppppp   rrrrr   rrrrrrrrr      ooooooooooo xxxxxxx      xxxxxxxyyyyyyy           yyyyyyy
p::::ppp:::::::::p  r::::rrr:::::::::r   oo:::::::::::oox:::::x    x:::::x  y:::::y         y:::::y
p:::::::::::::::::p r:::::::::::::::::r o:::::::::::::::ox:::::x  x:::::x    y:::::y       y:::::y
pp::::::ppppp::::::prr::::::rrrrr::::::ro:::::ooooo:::::o x:::::xx:::::x      y:::::y     y:::::y
 p:::::p     p:::::p r:::::r     r:::::ro::::o     o::::o  x::::::::::x        y:::::y   y:::::y
 p:::::p     p:::::p r:::::r     rrrrrrro::::o     o::::o   x::::::::x          y:::::y y:::::y
 p:::::p     p:::::p r:::::r            o::::o     o::::o   x::::::::x           y:::::y:::::y
 p:::::p    p::::::p r:::::r            o::::o     o::::o  x::::::::::x           y:::::::::y
 p:::::ppppp:::::::p r:::::r            o:::::ooooo:::::o x:::::xx:::::x           y:::::::y
 p::::::::::::::::p  r:::::r            o:::::::::::::::ox:::::x  x:::::x           y:::::y
 p::::::::::::::pp   r:::::r             oo:::::::::::oox:::::x    x:::::x         y:::::y
 p::::::pppppppp     rrrrrrr               ooooooooooo xxxxxxx      xxxxxxx       y:::::y
 p:::::p                                                                         y:::::y
 p:::::p                                                                        y:::::y
p:::::::p                                                                      y:::::y
p:::::::p                                                                     y:::::y
ppppppppp                                                                    yyyyyyy
///////////////////////////////////////////////////////////////////////////////////
| @author: jiminikiz
| @date: 2016-08-16
///////////////////////////////////////////////////////////////////////////////*/
const proxyMap = require('./vhosts');
const ssl = require('./ssl');
const bouncy  = require('bouncy');

function route( req, res, bounce ) {
    let host = req.headers.host;
    let port = proxyMap[ host ];

    if ( host !== undefined && port !== undefined ) {
        bounce({
            port: port,
            headers: {
                // this is a hack and is the reason why this
                // module should only be use in development
                'Connection': 'close',
                'X-Forwarded-Proto': 'https'
            }
        });
    } else {
        res.statusCode = 404;
        res.end( 'Could not resolve host: ' + host + ', port: ' + port );
    }
    console.log( '# Routing:'.green, host, ':', port, req.url );
}
function reportError ( error ) {
    if ( error ) {
        console.error('#ERROR'.bold.red, error );
    }
}

bouncy( route )
    .listen( 80 )
    .on('error', reportError );

if( ssl ) {
    bouncy(ssl, route ).listen( 443 ).on( 'error', reportError );
}

console.log('\n'+
'==========================\n'+
' # Proxy Server Started # \n'.cyan+
'==========================\n'
);
