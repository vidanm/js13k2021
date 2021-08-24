import kontra from 'rollup-plugin-kontra'

export default {
	  entry: 'game.js',
	  dest: 'game.bundle.js',
	  plugins: [
		      kontra({
				        gameObject: {velocity: true,
							        rotation: true
							      },
				        vector: {length: true
							      },  })
		    ]
}
