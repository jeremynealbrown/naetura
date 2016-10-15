function Hex() {
    

    function Canvas(ctx) {
        var ctx = ctx;
        var theta = 0;
        var flat_vertices = [];
        var sharp_vertices = [];
        var increment = Math.PI / 3.0;
        var sharp_offset = increment * 0.5;

        // Initialize vertices for both orientation types
        // These are "unit" coords and can be scaled and translated as needed
        for(var i = 0; i < 6; i++) {
            flat_vertices.push({
                x : Math.cos(theta),
                y : Math.sin(theta)
            });

            sharp_vertices.push({
                x : Math.cos(theta + sharp_offset),
                y : Math.sin(theta + sharp_offset)
            });

            theta += increment;
        }

        return {
            draw_hexagon : function(pixel_coords, radius, orientation, solid, stroke) {
                if(!ctx) return; 

                var vertices = orientation == 
                    Orientation.FLAT ? flat_vertices : sharp_vertices;

                ctx.beginPath();
                ctx.moveTo(pixel_coords[0], pixel_coords[1]);
                for(var i = 0; i < vertices.length; i++) {
                    var vertex = vertices[i];
                    var x = pixel_coords.x + vertex.x * radius;
                    var y = pixel_coords.y + vertex.y * radius;
                    if(i == 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                if(solid) ctx.fill();
                if(stroke) ctx.stroke();
            }
        }
    }

    function Cell(q, r, s) {
        if(q + r + s != 0) 
            throw 'Error creating HexCell. q+r+s != 0. Invalid values: (' + q + ', ' + r + ', ' + s + ')';

        var q = q || 0,
            r = r || 0,
            s = s || 0;

        return {
            plus : function(cell) {
                return Cell(
                    q + cell.q(),
                    r + cell.r(),
                    s + cell.s());
            },

            distance : function(cell) {
                return Math.floor((
                    Math.abs(q - cell.q()) + 
                    Math.abs(r - cell.r()) + 
                    Math.abs(s - cell.s())) / 2);
            },

            equals : function(cell) { 
                return q == cell.q()
                    && r == cell.r()
                    && s == cell.s();
            },

            q : function() { 
                return q; 
            }, 

            r : function() { 
                return r; 
            }, 

            s : function() { 
                return s; 
            }, 

            scale : function(scalar) {
                return Cell(
                    q * scalar, 
                    r * scalar, 
                    s * scalar);
            },

            minus : function(cell) {
                return Cell(
                    q - cell.q(),
                    r - cell.r(),
                    s - cell.s());
            }
        }
    }

    function Grid() {
        var cell_radius = 10;
        var orientation = Orientation.FLAT;

        return {
            cells : {},

            add : function(layout) {

            },

            cells : function() {
                return cells;
            },

            orientation : function(value) {
                if(value) {
                    orientation = value;
                    switch(value) {
                    case Orientation.SHARP:
                    case Orientation.FLAT:
                        orientation = value;
                    default:
                        break;
                    }
                }
                return orientation;
            },

            cell_radius : function(value) {
                if(value) {
                    cell_radius = value;
                }
                return cell_radius;
            },

            hex_to_pixel : function(cell) {
                var x = 0;
                var y = 0;
                switch(orientation) {
                    case Orientation.FLAT:
                        x = cell_radius * 3/2 * cell.q();
                        y = cell_radius * Math.sqrt(3) * (cell.r() + cell.q() * 0.5);
                        break;
                    case Orientation.SHARP:
                        x = cell_radius * Math.sqrt(3) * (cell.q() + cell.r() * 0.5);
                        y = cell_radius * 3/2 * cell.r();
                        break;
                }

                return {x: x, y: y};
            }, 

            pixel_to_hex : function(pixel) {

            }
        }
    }

    var Orientation = {
        SHARP : 'sharp',
        FLAT  : 'flat'
    }

    return {
        Canvas : Canvas,
        Cell : Cell,
        Grid : Grid, 
        Orientation : Orientation,
        Layout : function() {
            return {

            }
        }
    }
}
